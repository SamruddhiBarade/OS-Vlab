import os
import sys
import random
import string
from datetime import datetime

# Enable UTF-8 for Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Automatically load .env file if present
env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
if os.path.exists(env_file):
    try:
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if key and key not in os.environ:
                        os.environ[key] = val
    except Exception:
        pass

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__, static_folder=".")
CORS(app)

PORT = int(os.environ.get("PORT", 5000))
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017/os_virtual_lab")

# Connect to MongoDB with Smart Cloud & Local Fallback
mongo_status = {"connected": False, "db_name": "os_virtual_lab", "error": None, "source": "none"}
db = None
students_col = None
progress_col = None
certs_col = None

def init_mongo_connection(uri):
    global db, students_col, progress_col, certs_col, mongo_status
    client = MongoClient(uri, serverSelectionTimeoutMS=4000)
    client.admin.command('ping')
    
    db_name = "os_virtual_lab"
    if "/" in uri.split("?")[0]:
        potential_db = uri.split("?")[0].split("/")[-1]
        if potential_db:
            db_name = potential_db
            
    db = client[db_name]
    students_col = db["students"]
    progress_col = db["progress"]
    certs_col = db["certificates"]
    
    # Ensure indexes
    students_col.create_index("rollNo", unique=True)
    progress_col.create_index("rollNo", unique=True)
    certs_col.create_index("rollNo", unique=True)
    certs_col.create_index("certificateId", unique=True)
    
    mongo_status["connected"] = True
    mongo_status["db_name"] = db_name
    mongo_status["source"] = "Atlas Cloud" if "mongodb.net" in uri else "Local MongoDB"
    print(f"\n  [SUCCESS] Connected to MongoDB ({mongo_status['source']})!")
    print(f"  -> Database: {db_name}")
    print(f"  -> Host: {uri.split('@')[-1] if '@' in uri else uri}\n")
    return True

# Attempt primary connection (e.g. MongoDB Atlas)
connected = False
try:
    connected = init_mongo_connection(MONGO_URI)
except Exception as atlas_err:
    print(f"\n  [NOTICE] Cloud connection to Atlas timed out (Outbound port 27017 blocked on this Wi-Fi network).")
    print(f"  -> Attempting fallback to Local MongoDB (127.0.0.1:27017)...")
    
    # Try local MongoDB fallback
    try:
        connected = init_mongo_connection("mongodb://127.0.0.1:27017/os_virtual_lab")
    except Exception as local_err:
        mongo_status["connected"] = False
        mongo_status["error"] = f"Atlas: {atlas_err} | Local: {local_err}"
        print(f"  [WARNING] Could not connect to Local MongoDB either: {local_err}")
        print("  -> App will run in offline mode.\n")


# ----------------------------------------------------------------------
# API ROUTES
# ----------------------------------------------------------------------

@app.route("/api/status", methods=["GET"])
def get_status():
    student_count = 0
    cert_count = 0
    if mongo_status["connected"] and db is not None:
        try:
            student_count = students_col.count_documents({})
            cert_count = certs_col.count_documents({})
        except Exception:
            pass
            
    return jsonify({
        "success": True,
        "status": "connected" if mongo_status["connected"] else "disconnected",
        "database": mongo_status["db_name"],
        "source": mongo_status.get("source", "MongoDB"),
        "totalStudents": student_count,
        "totalCertificates": cert_count,
        "error": mongo_status["error"]
    })


@app.route("/api/students/login", methods=["POST"])
def student_login():
    if not mongo_status["connected"]:
        return jsonify({"success": False, "message": "MongoDB not connected."}), 503

    data = request.get_json(force=True) or {}
    name = data.get("name", "").strip()
    roll_no = data.get("rollNo", "").strip()
    dept = data.get("dept", "Computer Science & Engineering").strip()

    if not name or not roll_no:
        return jsonify({"success": False, "message": "Name and Roll No are required."}), 400

    now = datetime.utcnow()

    # Upsert student
    students_col.update_one(
        {"rollNo": roll_no},
        {
            "$set": {
                "name": name,
                "dept": dept,
                "lastLogin": now
            },
            "$setOnInsert": {
                "createdAt": now
            }
        },
        upsert=True
    )
    
    student = students_col.find_one({"rollNo": roll_no}, {"_id": 0})

    # Fetch progress or initialize
    prog_doc = progress_col.find_one({"rollNo": roll_no}, {"_id": 0})
    if not prog_doc:
        progress_col.insert_one({
            "rollNo": roll_no,
            "modules": {},
            "overallPercent": 0,
            "updatedAt": now
        })
        prog_doc = {"modules": {}, "overallPercent": 0}

    # Fetch certificate if already generated
    cert = certs_col.find_one({"rollNo": roll_no}, {"_id": 0})

    return jsonify({
        "success": True,
        "student": student,
        "progress": prog_doc.get("modules", {}),
        "overallPercent": prog_doc.get("overallPercent", 0),
        "certificate": cert
    })


@app.route("/api/progress/<roll_no>", methods=["GET"])
def get_progress(roll_no):
    if not mongo_status["connected"]:
        return jsonify({"success": False, "message": "MongoDB not connected."}), 503

    prog = progress_col.find_one({"rollNo": roll_no.strip()}, {"_id": 0})
    if not prog:
        return jsonify({"success": True, "progress": {}, "overallPercent": 0})

    return jsonify({
        "success": True,
        "progress": prog.get("modules", {}),
        "overallPercent": prog.get("overallPercent", 0)
    })


@app.route("/api/progress/<roll_no>", methods=["POST"])
def save_progress(roll_no):
    if not mongo_status["connected"]:
        return jsonify({"success": False, "message": "MongoDB not connected."}), 503

    data = request.get_json(force=True) or {}
    modules = data.get("progress", {})
    overall_percent = data.get("overallPercent", 0)

    progress_col.update_one(
        {"rollNo": roll_no.strip()},
        {
            "$set": {
                "modules": modules,
                "overallPercent": overall_percent,
                "updatedAt": datetime.utcnow()
            }
        },
        upsert=True
    )

    return jsonify({
        "success": True,
        "message": "Progress synchronized to MongoDB!",
        "overallPercent": overall_percent
    })


@app.route("/api/progress/<roll_no>/reset", methods=["POST"])
def reset_progress(roll_no):
    if not mongo_status["connected"]:
        return jsonify({"success": False, "message": "MongoDB not connected."}), 503

    progress_col.update_one(
        {"rollNo": roll_no.strip()},
        {
            "$set": {
                "modules": {},
                "overallPercent": 0,
                "updatedAt": datetime.utcnow()
            }
        }
    )
    certs_col.delete_many({"rollNo": roll_no.strip()})

    return jsonify({"success": True, "message": "Progress reset in MongoDB."})


@app.route("/api/certificates/generate", methods=["POST"])
def generate_certificate():
    if not mongo_status["connected"]:
        return jsonify({"success": False, "message": "MongoDB not connected."}), 503

    data = request.get_json(force=True) or {}
    roll_no = data.get("rollNo", "").strip()
    student_name = data.get("studentName", "").strip()
    dept = data.get("dept", "Computer Science & Engineering").strip()

    # Check progress verification from MongoDB
    prog = progress_col.find_one({"rollNo": roll_no})
    if not prog or prog.get("overallPercent", 0) < 100:
        return jsonify({
            "success": False,
            "message": "Cannot issue certificate: Course completion is below 100% in database."
        }), 400

    cert = certs_col.find_one({"rollNo": roll_no}, {"_id": 0})
    if not cert:
        rand_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        cert_id = f"OS-VLAB-2026-{rand_code}"
        now_str = datetime.utcnow().strftime("%B %d, %Y")

        cert = {
            "certificateId": cert_id,
            "rollNo": roll_no,
            "studentName": student_name,
            "dept": dept,
            "completionPercentage": 100,
            "issueDate": now_str,
            "createdAt": datetime.utcnow()
        }
        certs_col.insert_one(cert.copy())
        cert.pop("_id", None)

    return jsonify({"success": True, "certificate": cert})


@app.route("/api/certificates/<roll_no>", methods=["GET"])
def get_certificate(roll_no):
    if not mongo_status["connected"]:
        return jsonify({"success": False, "message": "MongoDB not connected."}), 503

    cert = certs_col.find_one({"rollNo": roll_no.strip()}, {"_id": 0})
    return jsonify({"success": True, "certificate": cert})


@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    if not mongo_status["connected"]:
        return jsonify({"success": False, "message": "MongoDB not connected."}), 503

    students = list(students_col.find({}, {"_id": 0}).sort("lastLogin", -1).limit(50))
    roll_nos = [s["rollNo"] for s in students]
    progs = {p["rollNo"]: p.get("overallPercent", 0) for p in progress_col.find({"rollNo": {"$in": roll_nos}})}

    leaderboard = []
    for s in students:
        leaderboard.append({
            "name": s.get("name"),
            "rollNo": s.get("rollNo"),
            "dept": s.get("dept"),
            "overallPercent": progs.get(s.get("rollNo"), 0)
        })

    leaderboard.sort(key=lambda x: x["overallPercent"], reverse=True)
    return jsonify({"success": True, "leaderboard": leaderboard})


# Static frontend file routes
@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/<path:path>")
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory(".", path)
    return send_from_directory(".", "index.html")


if __name__ == "__main__":
    print(f"\n  ================================================================")
    print(f"  [START] OS Virtual Lab Server Running!")
    print(f"  -> Access in Browser: http://localhost:{PORT}")
    print(f"  -> API Health:        http://localhost:{PORT}/api/status")
    print(f"  ================================================================\n")
    app.run(host="0.0.0.0", port=PORT, debug=False)
