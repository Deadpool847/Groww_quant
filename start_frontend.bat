@echo off
:: Start Aladdin Frontend Server
title Aladdin Frontend Server

color 0B
echo ========================================================================
echo                   ALADDIN TRADING PLATFORM - FRONTEND
echo ========================================================================
echo.

cd /d "%~dp0frontend"

:: Check if node_modules exists
if not exist node_modules (
    echo [ERROR] Frontend dependencies not found!
    echo Please run install_aladdin.bat first to install dependencies.
    pause
    exit /b 1
)

:: Check if backend is running
echo [INFO] Checking if backend server is running...
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Backend server not detected at http://localhost:8001
    echo [INFO] Please start the backend server first using start_backend.bat
    echo.
)

:: Start the frontend server
echo [INFO] Starting Aladdin Frontend Server...
echo.
echo 🚀 Frontend URLs:
echo    Main Application: http://localhost:3000
echo    Local Network: http://192.168.1.x:3000 (if available)
echo.
echo 📱 Features Available:
echo    📊 Portfolio Dashboard
echo    📈 Real-time Market Data  
echo    🔍 Risk Analytics
echo    💼 Portfolio Management
echo    📋 Order Placement & Tracking
echo    📊 Performance Analytics
echo.
echo [INFO] The application will automatically open in your default browser
echo [INFO] Press Ctrl+C to stop the server
echo ========================================================================
echo.

yarn start

echo.
echo [INFO] Frontend server stopped.
pause