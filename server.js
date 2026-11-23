import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/os_virtual_lab';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// -------------------------------------------------------------
// MONGOOSE SCHEMAS & MODELS
// -------------------------------------------------------------

// Student Schema
const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  dept: { type: String, default: 'Computer Science & Engineering' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// Module Progress Schema
const progressSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true, trim: true },
  modules: {
    type: Map,
    of: new mongoose.Schema({
      learn: { type: Boolean, default: false },
      animation: { type: Boolean, default: false },
      task: { type: Boolean, default: false },
      terminal: { type: Boolean, default: false },
      quiz: { type: Boolean, default: false },
      completed: { type: Boolean, default: false },
      quizScore: { type: Number, default: 0 }
    }, { _id: false }),
    default: {}
  },
  overallPercent: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

const Progress = mongoose.model('Progress', progressSchema);

// Certificate Record Schema
const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  rollNo: { type: String, required: true, trim: true },
  studentName: { type: String, required: true },
  dept: { type: String, required: true },
  completionPercentage: { type: Number, default: 100 },
  issuedAt: { type: Date, default: Date.now }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

// -------------------------------------------------------------
// DATABASE CONNECTION
// -------------------------------------------------------------
let dbConnectionState = {
  status: 'disconnected',
  database: 'os_virtual_lab',
  error: null
};

async function connectToMongo() {
  try {
    dbConnectionState.status = 'connecting';
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    dbConnectionState.status = 'connected';
    dbConnectionState.error = null;
    console.log(`\n  🟢 MongoDB connected successfully!`);
    console.log(`  ➜ Database: ${mongoose.connection.name}`);
    console.log(`  ➜ URI: ${MONGO_URI}\n`);
  } catch (err) {
    dbConnectionState.status = 'error';
    dbConnectionState.error = err.message;
    console.error(`\n  🔴 MongoDB connection error:`, err.message);
    console.log(`  💡 App will continue running. Check if local MongoDB service is active or update MONGO_URI in .env.\n`);
  }
}

connectToMongo();

mongoose.connection.on('disconnected', () => {
  dbConnectionState.status = 'disconnected';
});
mongoose.connection.on('connected', () => {
  dbConnectionState.status = 'connected';
});

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Health & Connection Status
app.get('/api/status', async (req, res) => {
  try {
    const studentCount = dbConnectionState.status === 'connected' ? await Student.countDocuments() : 0;
    const certCount = dbConnectionState.status === 'connected' ? await Certificate.countDocuments() : 0;
    res.json({
      success: true,
      status: dbConnectionState.status,
      database: mongoose.connection.name || 'os_virtual_lab',
      uri: MONGO_URI.replace(/:([^:@]+)@/, ':****@'), // mask password if present
      totalStudents: studentCount,
      totalCertificates: certCount,
      error: dbConnectionState.error
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Student Login / Registration
app.post('/api/students/login', async (req, res) => {
  try {
    const { name, rollNo, dept } = req.body;
    if (!name || !rollNo) {
      return res.status(400).json({ success: false, message: 'Name and Roll No are required.' });
    }

    if (dbConnectionState.status !== 'connected') {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is currently not connected. Using local storage mode.'
      });
    }

    // Upsert Student
    const student = await Student.findOneAndUpdate(
      { rollNo: rollNo.trim() },
      {
        $set: {
          name: name.trim(),
          dept: dept ? dept.trim() : 'Computer Science & Engineering',
          lastLogin: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true, new: true }
    );

    // Fetch existing progress
    let progDoc = await Progress.findOne({ rollNo: student.rollNo });
    if (!progDoc) {
      progDoc = await Progress.create({
        rollNo: student.rollNo,
        modules: {},
        overallPercent: 0
      });
    }

    // Check if certificate already issued
    const certificate = await Certificate.findOne({ rollNo: student.rollNo });

    res.json({
      success: true,
      student,
      progress: progDoc.modules,
      overallPercent: progDoc.overallPercent,
      certificate
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get Student Progress
app.get('/api/progress/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    if (dbConnectionState.status !== 'connected') {
      return res.status(503).json({ success: false, message: 'Database disconnected' });
    }

    const progDoc = await Progress.findOne({ rollNo });
    if (!progDoc) {
      return res.json({ success: true, progress: {}, overallPercent: 0 });
    }

    res.json({
      success: true,
      progress: progDoc.modules,
      overallPercent: progDoc.overallPercent
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Save / Update Student Progress
app.post('/api/progress/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    const { progress, overallPercent } = req.body;

    if (dbConnectionState.status !== 'connected') {
      return res.status(503).json({ success: false, message: 'Database disconnected' });
    }

    const updated = await Progress.findOneAndUpdate(
      { rollNo },
      {
        $set: {
          modules: progress,
          overallPercent: overallPercent || 0,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, progress: updated.modules, overallPercent: updated.overallPercent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Reset Student Progress
app.post('/api/progress/:rollNo/reset', async (req, res) => {
  try {
    const { rollNo } = req.params;
    if (dbConnectionState.status !== 'connected') {
      return res.status(503).json({ success: false, message: 'Database disconnected' });
    }

    await Progress.findOneAndUpdate(
      { rollNo },
      { $set: { modules: {}, overallPercent: 0, updatedAt: new Date() } }
    );

    await Certificate.deleteMany({ rollNo });

    res.json({ success: true, message: 'Student progress reset successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Generate and Issue Certificate (Requires 100% completion in DB)
app.post('/api/certificates/generate', async (req, res) => {
  try {
    const { rollNo, studentName, dept } = req.body;

    if (dbConnectionState.status !== 'connected') {
      return res.status(503).json({ success: false, message: 'Database disconnected' });
    }

    // Verify progress
    const progDoc = await Progress.findOne({ rollNo });
    if (!progDoc || progDoc.overallPercent < 100) {
      return res.status(400).json({
        success: false,
        message: 'Cannot issue certificate! 100% course completion required across all 10 modules.'
      });
    }

    // Check if certificate already exists
    let cert = await Certificate.findOne({ rollNo });
    if (!cert) {
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const certificateId = `OS-VLAB-2026-${randomCode}`;

      cert = await Certificate.create({
        certificateId,
        rollNo,
        studentName: studentName || 'Student',
        dept: dept || 'Computer Science & Engineering',
        completionPercentage: 100,
        issuedAt: new Date()
      });
    }

    res.json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Get Certificate Details
app.get('/api/certificates/:rollNo', async (req, res) => {
  try {
    const { rollNo } = req.params;
    if (dbConnectionState.status !== 'connected') {
      return res.status(503).json({ success: false, message: 'Database disconnected' });
    }

    const cert = await Certificate.findOne({ rollNo });
    res.json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Class Leaderboard (Students with progress & quiz performance)
app.get('/api/leaderboard', async (req, res) => {
  try {
    if (dbConnectionState.status !== 'connected') {
      return res.status(503).json({ success: false, message: 'Database disconnected' });
    }

    const students = await Student.find().sort({ lastLogin: -1 }).limit(50);
    const progressList = await Progress.find({ rollNo: { $in: students.map(s => s.rollNo) } });

    const progMap = {};
    progressList.forEach(p => {
      progMap[p.rollNo] = p.overallPercent;
    });

    const leaderboard = students.map(s => ({
      name: s.name,
      rollNo: s.rollNo,
      dept: s.dept,
      overallPercent: progMap[s.rollNo] || 0,
      lastLogin: s.lastLogin
    })).sort((a, b) => b.overallPercent - a.overallPercent);

    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for frontend single page app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n  ======================================================`);
  console.log(`  🚀 OS Virtual Lab Full-Stack Server Started!`);
  console.log(`  ➜ Server & Web App: http://localhost:${PORT}`);
  console.log(`  ➜ API Base: http://localhost:${PORT}/api/status`);
  console.log(`  ➜ MongoDB URI: ${MONGO_URI}`);
  console.log(`  ======================================================\n`);
});
