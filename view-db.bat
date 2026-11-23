@echo off
title OS Virtual Lab - MongoDB Viewer
echo ========================================================
echo    Checking MongoDB Database: os_virtual_lab
echo ========================================================
echo.
mongosh "mongodb://127.0.0.1:27017/os_virtual_lab" --eval "console.log('\n--- REGISTERED STUDENTS ---'); printjson(db.students.find().toArray()); console.log('\n--- STUDENT PROGRESS ---'); printjson(db.progress.find().toArray()); console.log('\n--- CERTIFICATES ---'); printjson(db.certificates.find().toArray());"
echo.
echo ========================================================
pause
