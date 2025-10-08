@echo off
:: Start Required Services for Aladdin Trading Platform
title Aladdin Services Manager

color 0D
echo ========================================================================
echo                    ALADDIN SERVICES MANAGER
echo ========================================================================
echo.
echo This script will start all required services for the trading platform.
echo.

:: Check if running as Administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Not running as Administrator.
    echo Some services may fail to start without admin privileges.
    echo For best results, right-click and "Run as administrator"
    echo.
    timeout /t 3 >nul
)

echo [SERVICE 1/2] Starting Redis Server...
:: Try to start Redis service
net start Redis >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Redis service started successfully
) else (
    :: Try alternative Redis startup methods
    sc query Redis >nul 2>&1
    if %errorlevel% equ 0 (
        echo ⚠️  Redis service exists but failed to start - may already be running
    ) else (
        echo ❌ Redis service not found
        echo.
        echo Options to install Redis:
        echo   1. Download Redis for Windows: https://github.com/microsoftarchive/redis/releases
        echo   2. Use WSL2 with Ubuntu and install: sudo apt install redis-server
        echo   3. Use Docker: docker run -d -p 6379:6379 redis:alpine
        echo.
        echo For now, continuing without Redis (caching will be disabled)
    )
)
echo.

echo [SERVICE 2/2] Starting MongoDB...
:: Try to start MongoDB service  
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB service started successfully
) else (
    sc query MongoDB >nul 2>&1
    if %errorlevel% equ 0 (
        echo ⚠️  MongoDB service exists but failed to start - may already be running
    ) else (
        echo ❌ MongoDB service not found
        echo.
        echo To install MongoDB:
        echo   1. Download MongoDB Community: https://www.mongodb.com/try/download/community
        echo   2. Install as Windows Service during setup
        echo   3. Or use MongoDB Atlas cloud database
        echo.
        echo For now, continuing without MongoDB (using in-memory storage)
    )
)
echo.

:: Verify services are running
echo ========================================================================
echo                           SERVICE STATUS CHECK
echo ========================================================================
echo.

:: Check Redis
echo [CHECKING] Redis status...
netstat -ano | findstr ":6379" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Redis is running on port 6379
) else (
    echo ❌ Redis is not running on port 6379
)

:: Check MongoDB
echo [CHECKING] MongoDB status...
netstat -ano | findstr ":27017" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB is running on port 27017
) else (
    echo ❌ MongoDB is not running on port 27017
)
echo.

echo ========================================================================
echo                              NEXT STEPS
echo ========================================================================
echo.
echo Services startup complete! Now you can:
echo.
echo   🚀 Start Backend:   double-click start_backend.bat
echo   🎨 Start Frontend:  double-click start_frontend.bat
echo   🔍 Health Check:   double-click check_services.bat
echo.
echo Or use VS Code:
echo   📝 Open Project:   double-click open_vscode.bat
echo.
echo The application will be available at:
echo   📊 Backend API:    http://localhost:8001
echo   🌐 Frontend:      http://localhost:3000
echo   📖 API Docs:      http://localhost:8001/api/docs
echo.

pause