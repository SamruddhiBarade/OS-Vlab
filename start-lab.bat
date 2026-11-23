@echo off
title OS Virtual Lab Launcher
echo ========================================================
echo    Starting OS Virtual Lab with MongoDB Connection...
echo ========================================================
echo.
cd /d "%~dp0"
start "" http://localhost:5000
python app.py
pause
