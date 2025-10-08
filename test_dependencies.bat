@echo off
:: Test All Dependencies for Aladdin Trading Platform
title Aladdin Dependencies Test

color 0E
echo ========================================================================
echo                    ALADDIN DEPENDENCIES VERIFICATION
echo ========================================================================
echo.
echo This script will test all required dependencies and provide
echo installation instructions for any missing components.
echo.

set ERRORS=0

:: Test Python
echo [TEST 1/8] Python Installation
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('python --version') do (
        echo ✅ Python %%i found
        
        :: Check Python version (should be 3.11+)
        python -c "import sys; exit(0 if sys.version_info >= (3,11) else 1)" >nul 2>&1
        if !errorlevel! equ 0 (
            echo    ✅ Version is 3.11+ compatible
        ) else (
            echo    ⚠️  Warning: Python 3.11+ recommended for best compatibility
        )
    )
) else (
    echo ❌ Python not found or not in PATH
    echo    Install from: https://python.org/downloads
    echo    ⚠️  IMPORTANT: Check "Add Python to PATH" during installation
    set /a ERRORS+=1
)
echo.

:: Test pip
echo [TEST 2/8] pip Package Manager
python -m pip --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ pip package manager available
) else (
    echo ❌ pip not available
    echo    Usually comes with Python - try reinstalling Python
    set /a ERRORS+=1
)
echo.

:: Test Node.js
echo [TEST 3/8] Node.js Installation
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=1" %%i in ('node --version') do (
        echo ✅ Node.js %%i found
        
        :: Check Node.js version (should be 18+)
        node -e "process.exit(parseInt(process.version.slice(1)) >= 18 ? 0 : 1)" >nul 2>&1
        if !errorlevel! equ 0 (
            echo    ✅ Version is 18+ compatible
        ) else (
            echo    ⚠️  Warning: Node.js 18+ LTS recommended
        )
    )
) else (
    echo ❌ Node.js not found or not in PATH
    echo    Install Node.js 18+ LTS from: https://nodejs.org
    set /a ERRORS+=1
)
echo.

:: Test npm
echo [TEST 4/8] npm Package Manager
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=1" %%i in ('npm --version') do echo ✅ npm %%i available
) else (
    echo ❌ npm not available
    echo    Usually comes with Node.js - try reinstalling Node.js
    set /a ERRORS+=1
)
echo.

:: Test Yarn
echo [TEST 5/8] Yarn Package Manager
yarn --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=1" %%i in ('yarn --version') do echo ✅ Yarn %%i available
) else (
    echo ⚠️  Yarn not found - will be installed during setup
    echo    Or install manually: npm install -g yarn
)
echo.

:: Test Git
echo [TEST 6/8] Git Version Control
git --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=3" %%i in ('git --version') do echo ✅ Git %%i available
) else (
    echo ❌ Git not found
    echo    Install from: https://git-scm.com/download/win
    echo    ⚠️  Required for some package installations
    set /a ERRORS+=1
)
echo.

:: Test curl (for API testing)
echo [TEST 7/8] curl HTTP Client
curl --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ curl available for API testing
) else (
    echo ⚠️  curl not found - API testing will be limited
    echo    curl comes with Windows 10+ or install separately
)
echo.

:: Test VS Code
echo [TEST 8/8] Visual Studio Code
where code >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ VS Code command-line interface available
) else (
    echo ⚠️  VS Code CLI not in PATH
    echo    Install from: https://code.visualstudio.com
    echo    Or ensure "Add to PATH" was selected during installation
)
echo.

:: Check Windows Services (Redis & MongoDB)
echo ========================================================================
echo                           SERVICES CHECK
echo ========================================================================
echo.

echo [SERVICE 1/2] Redis Service
sc query Redis >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Redis service is installed
    for /f "tokens=4" %%i in ('sc query Redis ^| findstr "STATE"') do (
        if "%%i"=="RUNNING" (
            echo    ✅ Redis is currently running
        ) else (
            echo    ⚠️  Redis is installed but not running
        )
    )
) else (
    echo ❌ Redis service not found
    echo    Install options:
    echo    1. Download: https://github.com/microsoftarchive/redis/releases
    echo    2. Use WSL2: wsl --install then sudo apt install redis-server
    echo    3. Use Docker: docker run -d -p 6379:6379 redis:alpine
    set /a ERRORS+=1
)
echo.

echo [SERVICE 2/2] MongoDB Service  
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB service is installed
    for /f "tokens=4" %%i in ('sc query MongoDB ^| findstr "STATE"') do (
        if "%%i"=="RUNNING" (
            echo    ✅ MongoDB is currently running
        ) else (
            echo    ⚠️  MongoDB is installed but not running
        )
    )
) else (
    echo ❌ MongoDB service not found
    echo    Install from: https://www.mongodb.com/try/download/community
    echo    ⚠️  Choose "Install MongoDB as a Service" during setup
    set /a ERRORS+=1
)
echo.

:: Port availability check
echo ========================================================================
echo                           PORT AVAILABILITY
echo ========================================================================
echo.

echo [PORT 1/4] Backend Port 8001
netstat -ano | findstr ":8001" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 8001 is already in use
    echo    This is normal if backend is running
) else (
    echo ✅ Port 8001 is available for backend
)

echo [PORT 2/4] Frontend Port 3000  
netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is already in use
    echo    This is normal if frontend is running
) else (
    echo ✅ Port 3000 is available for frontend
)

echo [PORT 3/4] Redis Port 6379
netstat -ano | findstr ":6379" >nul 2>&1  
if %errorlevel% equ 0 (
    echo ✅ Port 6379 is in use (Redis running)
) else (
    echo ⚠️  Port 6379 is free (Redis not running)
)

echo [PORT 4/4] MongoDB Port 27017
netstat -ano | findstr ":27017" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Port 27017 is in use (MongoDB running)  
) else (
    echo ⚠️  Port 27017 is free (MongoDB not running)
)
echo.

:: Summary and recommendations
echo ========================================================================
echo                              SUMMARY
echo ========================================================================
echo.

if %ERRORS% equ 0 (
    color 0A
    echo ✅ ALL CRITICAL DEPENDENCIES FOUND!
    echo.
    echo Your system is ready for Aladdin Trading Platform installation.
    echo.
    echo 🚀 NEXT STEPS:
    echo    1. Run install_aladdin.bat to install the platform
    echo    2. Make sure Redis and MongoDB services are running
    echo    3. Configure your Groww API credentials in backend\.env
    echo    4. Start the application with the provided batch files
) else (
    color 0C
    echo ❌ %ERRORS% CRITICAL DEPENDENCIES MISSING
    echo.
    echo Please install the missing components before proceeding:
    echo.
    echo 📋 INSTALLATION PRIORITY:
    echo    1. Python 3.11+ (CRITICAL)
    echo    2. Node.js 18+ LTS (CRITICAL)  
    echo    3. Git (RECOMMENDED)
    echo    4. Redis (REQUIRED for caching)
    echo    5. MongoDB (REQUIRED for data storage)
    echo    6. VS Code (RECOMMENDED for development)
    echo.
    echo After installing missing components:
    echo    • Restart your command prompt
    echo    • Run this test again to verify
    echo    • Then run install_aladdin.bat
)
echo.

echo ========================================================================
echo                         INSTALLATION LINKS
echo ========================================================================
echo.
echo 🐍 Python 3.11+:     https://python.org/downloads
echo 📦 Node.js 18+ LTS:  https://nodejs.org  
echo 📝 VS Code:          https://code.visualstudio.com
echo 🔧 Git:              https://git-scm.com/download/win
echo 🔴 Redis:            https://github.com/microsoftarchive/redis/releases
echo 🍃 MongoDB:          https://www.mongodb.com/try/download/community
echo.
echo 💡 TIP: Download and install all at once, then restart your computer
echo    and run this test again to verify everything is working.
echo.

pause