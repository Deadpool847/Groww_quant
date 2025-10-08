@echo off
:: Comprehensive Aladdin Services Health Check
title Aladdin Services Health Check

color 0F
echo ========================================================================
echo                    ALADDIN SERVICES HEALTH CHECK
echo ========================================================================
echo.

:: Check Python installation
echo [CHECK 1/8] Python Installation
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('python --version') do echo ✅ Python %%i installed
) else (
    echo ❌ Python not found or not in PATH
)
echo.

:: Check Node.js installation
echo [CHECK 2/8] Node.js Installation  
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=1" %%i in ('node --version') do echo ✅ Node.js %%i installed
) else (
    echo ❌ Node.js not found or not in PATH
)
echo.

:: Check Redis service
echo [CHECK 3/8] Redis Service Status
sc query Redis >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=4" %%i in ('sc query Redis ^| findstr "STATE"') do (
        if "%%i"=="RUNNING" (
            echo ✅ Redis service is running
        ) else (
            echo ⚠️  Redis service exists but not running - attempting to start...
            net start Redis >nul 2>&1
        )
    )
) else (
    echo ❌ Redis service not installed
    echo    Download from: https://github.com/microsoftarchive/redis/releases
)
echo.

:: Check MongoDB service
echo [CHECK 4/8] MongoDB Service Status
sc query MongoDB >nul 2>&1  
if %errorlevel% equ 0 (
    for /f "tokens=4" %%i in ('sc query MongoDB ^| findstr "STATE"') do (
        if "%%i"=="RUNNING" (
            echo ✅ MongoDB service is running
        ) else (
            echo ⚠️  MongoDB service exists but not running - attempting to start...
            net start MongoDB >nul 2>&1
        )
    )
) else (
    echo ❌ MongoDB service not installed  
    echo    Download from: https://www.mongodb.com/try/download/community
)
echo.

:: Check backend virtual environment
echo [CHECK 5/8] Backend Virtual Environment
cd /d "%~dp0backend" 2>nul
if exist venv\Scripts\python.exe (
    echo ✅ Backend virtual environment exists
) else (
    echo ❌ Backend virtual environment not found
    echo    Run install_aladdin.bat to create it
)
echo.

:: Check frontend dependencies
echo [CHECK 6/8] Frontend Dependencies
cd /d "%~dp0frontend" 2>nul
if exist node_modules (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Frontend dependencies not found
    echo    Run install_aladdin.bat to install them
)
echo.

:: Check backend server
echo [CHECK 7/8] Backend Server Health
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend server is responding
    echo [INFO] Testing API endpoint...
    curl -s "http://localhost:8001/api/v1/portfolio/" | findstr "portfolios" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ API endpoints are working
    ) else (
        echo ⚠️  Backend responding but API may have issues
    )
) else (
    echo ❌ Backend server not responding on http://localhost:8001
    echo    Run start_backend.bat to start it
)
echo.

:: Check frontend server
echo [CHECK 8/8] Frontend Server Health
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend server is responding
) else (
    echo ❌ Frontend server not responding on http://localhost:3000  
    echo    Run start_frontend.bat to start it
)
echo.

:: Port usage check
echo ========================================================================
echo                           PORT USAGE STATUS
echo ========================================================================
echo [INFO] Checking port usage...
netstat -ano | findstr ":8001" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 8001 (Backend) is in use
) else (
    echo ❌ Port 8001 (Backend) is free - backend not running
)

netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 3000 (Frontend) is in use
) else (
    echo ❌ Port 3000 (Frontend) is free - frontend not running
)

netstat -ano | findstr ":6379" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 6379 (Redis) is in use
) else (
    echo ❌ Port 6379 (Redis) is free - Redis not running
)

netstat -ano | findstr ":27017" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 27017 (MongoDB) is in use  
) else (
    echo ❌ Port 27017 (MongoDB) is free - MongoDB not running
)
echo.

:: Environment file check
echo ========================================================================
echo                        CONFIGURATION STATUS
echo ========================================================================
cd /d "%~dp0backend" 2>nul
if exist .env (
    echo ✅ Backend .env file exists
    findstr "your_api_key_here" .env >nul 2>&1
    if %errorlevel% equ 0 (
        echo ⚠️  Groww API credentials are still placeholder values
        echo    Edit backend\.env with your actual Groww API credentials
    ) else (
        echo ✅ Groww API credentials appear to be configured
    )
) else (
    echo ❌ Backend .env file missing
    echo    Copy .env.example to .env and configure it
)
echo.

echo ========================================================================
echo                            SUMMARY & ACTIONS
echo ========================================================================
echo.
echo To start the complete application:
echo   1. Run: start_services.bat (starts Redis + MongoDB)
echo   2. Run: start_backend.bat (starts API server) 
echo   3. Run: start_frontend.bat (starts web interface)
echo   4. Open: http://localhost:3000 in your browser
echo.
echo For troubleshooting:
echo   - Check individual startup scripts for error messages
echo   - Verify all services are running using this health check
echo   - Check WINDOWS_INSTALLATION_GUIDE.txt for detailed help
echo.

pause