@echo off
:: Start Aladdin Backend Server
title Aladdin Backend Server

color 0E
echo ========================================================================
echo                    ALADDIN TRADING PLATFORM - BACKEND
echo ========================================================================
echo.

cd /d "%~dp0backend"

:: Check if virtual environment exists
if not exist venv (
    echo [ERROR] Virtual environment not found!
    echo Please run install_aladdin.bat first to set up the environment.
    pause
    exit /b 1
)

:: Activate virtual environment
echo [INFO] Activating Python virtual environment...
call venv\Scripts\activate.bat

:: Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found! Creating from template...
    copy .env.example .env
    echo [INFO] Please edit .env file with your Groww API credentials
    echo [INFO] File location: %~dp0backend\.env
)

:: Start the backend server
echo [INFO] Starting Aladdin Backend Server...
echo.
echo 🚀 Backend Server URLs:
echo    Main API: http://localhost:8001
echo    Health Check: http://localhost:8001/health  
echo    API Documentation: http://localhost:8001/api/docs
echo    Interactive API: http://localhost:8001/api/redoc
echo.
echo 📊 Available Endpoints:
echo    📈 Market Data: http://localhost:8001/api/v1/market/
echo    💼 Portfolio: http://localhost:8001/api/v1/portfolio/
echo    📋 Orders: http://localhost:8001/api/v1/orders/
echo    📊 Analytics: http://localhost:8001/api/v1/analytics/
echo.
echo [INFO] Press Ctrl+C to stop the server
echo ========================================================================
echo.

python main.py

echo.
echo [INFO] Backend server stopped.
pause