@echo off
title CosmicMind Launcher
color 0b

echo ===================================================
echo           COSMIC MIND SYSTEM BOOT SEQUENCE
echo ===================================================
echo.

echo [1/2] Initializing Neural Backend...
start "CosmicMind Server" /D "server" npm start

echo [2/2] Launching Visual Interface...
start "CosmicMind Client" npm run dev

echo.
echo ===================================================
echo              SYSTEM ONLINE
echo ===================================================
echo Backend running on Port 3001
echo Frontend launching...
echo.
timeout /t 5 >nul
exit
