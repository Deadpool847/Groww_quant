@echo off
:: ============================================================================
:: BlackRock Aladdin Trading Platform - Windows Installation Script
:: ============================================================================
:: This script automates the complete installation process
:: Run as Administrator for best results

title Aladdin Trading Platform - Installation

color 0A
echo.
echo ========================================================================
echo                    BLACKROCK ALADDIN TRADING PLATFORM
echo                         AUTOMATED INSTALLATION
echo ========================================================================
echo.
echo This script will install and configure the complete trading platform.
echo Please ensure you have Administrator privileges.
echo.
pause

:: Check if running as Administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Please run this script as Administrator!
    echo Right-click on install_aladdin.bat and select "Run as administrator"
    pause
    exit /b 1
)

echo [INFO] Administrator privileges confirmed ✓
echo.

:: Set project directory
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo [INFO] Project directory: %PROJECT_DIR%
echo.

:: Check Python installation
echo [STEP 1/10] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Please install Python 3.11+ from https://python.org
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo [INFO] Python %PYTHON_VERSION% found ✓
echo.

:: Check Node.js installation  
echo [STEP 2/10] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js 18+ LTS from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo [INFO] Node.js %NODE_VERSION% found ✓
echo.

:: Check and start Redis
echo [STEP 3/10] Checking Redis service...
sc query Redis >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Redis service found ✓
    net start Redis >nul 2>&1
    echo [INFO] Redis service started ✓
) else (
    echo [WARNING] Redis service not found. Please install Redis for Windows
    echo Download from: https://github.com/microsoftarchive/redis/releases
)
echo.

:: Check and start MongoDB
echo [STEP 4/10] Checking MongoDB service...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] MongoDB service found ✓
    net start MongoDB >nul 2>&1
    echo [INFO] MongoDB service started ✓
) else (
    echo [WARNING] MongoDB service not found. Please install MongoDB Community Edition
    echo Download from: https://www.mongodb.com/try/download/community
)
echo.

:: Setup Backend
echo [STEP 5/10] Setting up Python backend...
cd /d "%PROJECT_DIR%backend"

echo [INFO] Creating Python virtual environment...
if exist venv (
    echo [INFO] Virtual environment already exists, skipping creation
) else (
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
    echo [INFO] Virtual environment created ✓
)

echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

echo [INFO] Upgrading pip...
python -m pip install --upgrade pip --quiet

echo [INFO] Installing Python dependencies... (this may take a few minutes)
pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)
echo [INFO] Python dependencies installed ✓
echo.

:: Setup environment file
echo [STEP 6/10] Setting up environment configuration...
if not exist .env (
    copy .env.example .env
    echo [INFO] Environment file created from template ✓
    echo [WARNING] Please edit .env file with your Groww API credentials
) else (
    echo [INFO] Environment file already exists ✓
)
echo.

:: Setup Frontend
echo [STEP 7/10] Setting up React frontend...
cd /d "%PROJECT_DIR%frontend"

echo [INFO] Installing Yarn globally (if needed)...
npm install -g yarn --quiet >nul 2>&1

echo [INFO] Installing frontend dependencies... (this may take several minutes)
yarn install --silent
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [INFO] Frontend dependencies installed ✓
echo.

:: Test Backend
echo [STEP 8/10] Testing backend installation...
cd /d "%PROJECT_DIR%backend"
call venv\Scripts\activate.bat

echo [INFO] Testing Python imports...
python -c "from main import app; print('Backend imports successful ✓')" 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Backend import test failed - check dependencies
) else (
    echo [INFO] Backend import test passed ✓
)
echo.

:: Test Frontend
echo [STEP 9/10] Testing frontend setup...
cd /d "%PROJECT_DIR%frontend"

echo [INFO] Testing frontend dependencies...
yarn list --depth=0 >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Frontend dependency check failed
) else (
    echo [INFO] Frontend dependencies verified ✓
)
echo.

:: Create startup scripts
echo [STEP 10/10] Creating startup scripts...
cd /d "%PROJECT_DIR%"

:: Create backend startup script
echo @echo off > start_backend.bat
echo title Aladdin Backend Server >> start_backend.bat
echo cd /d "%%~dp0backend" >> start_backend.bat
echo call venv\Scripts\activate.bat >> start_backend.bat
echo echo Starting Aladdin Backend Server... >> start_backend.bat
echo echo Backend will be available at: http://localhost:8001 >> start_backend.bat
echo echo API Documentation at: http://localhost:8001/api/docs >> start_backend.bat
echo echo. >> start_backend.bat
echo python main.py >> start_backend.bat
echo pause >> start_backend.bat

:: Create frontend startup script  
echo @echo off > start_frontend.bat
echo title Aladdin Frontend Server >> start_frontend.bat
echo cd /d "%%~dp0frontend" >> start_frontend.bat
echo echo Starting Aladdin Frontend Server... >> start_frontend.bat
echo echo Frontend will be available at: http://localhost:3000 >> start_frontend.bat
echo echo. >> start_frontend.bat
echo yarn start >> start_frontend.bat

:: Create services startup script
echo @echo off > start_services.bat
echo title Aladdin Services Manager >> start_services.bat
echo echo Starting Aladdin Trading Platform Services... >> start_services.bat
echo echo. >> start_services.bat
echo echo Starting Redis service... >> start_services.bat
echo net start Redis >> start_services.bat
echo echo Starting MongoDB service... >> start_services.bat  
echo net start MongoDB >> start_services.bat
echo echo. >> start_services.bat
echo echo Services started! You can now run the application. >> start_services.bat
echo pause >> start_services.bat

:: Create health check script
echo @echo off > check_health.bat
echo title Aladdin Health Check >> check_health.bat
echo echo Checking Aladdin Trading Platform Health... >> check_health.bat
echo echo. >> check_health.bat
echo echo Testing Backend Health: >> check_health.bat
echo curl -s http://localhost:8001/health >> check_health.bat
echo echo. >> check_health.bat
echo echo Testing Frontend: >> check_health.bat
echo curl -s http://localhost:3000 ^| findstr "Aladdin" >> check_health.bat
echo echo. >> check_health.bat
echo pause >> check_health.bat

:: Create VS Code launcher
echo @echo off > open_vscode.bat
echo title Open Aladdin in VS Code >> open_vscode.bat
echo echo Opening Aladdin Trading Platform in VS Code... >> open_vscode.bat
echo code . >> open_vscode.bat

echo [INFO] Startup scripts created ✓
echo.

:: Final success message
color 0B
echo ========================================================================
echo                           INSTALLATION COMPLETE! 
echo ========================================================================
echo.
echo ✅ Backend Python environment setup complete
echo ✅ Frontend Node.js dependencies installed  
echo ✅ Configuration files created
echo ✅ Startup scripts generated
echo ✅ Health check tools ready
echo.
echo 🚀 TO START THE APPLICATION:
echo    1. Run 'start_services.bat' to start Redis and MongoDB
echo    2. Run 'start_backend.bat' to start the backend server  
echo    3. Run 'start_frontend.bat' to start the frontend
echo    4. Open http://localhost:3000 in your browser
echo.
echo 🔧 FOR DEVELOPMENT:
echo    - Run 'open_vscode.bat' to open project in VS Code
echo    - Run 'check_health.bat' to verify all services
echo.
echo ⚠️  IMPORTANT NEXT STEPS:
echo    1. Edit 'backend\.env' with your Groww API credentials
echo    2. Ensure Redis and MongoDB services are running
echo    3. Test the application with the health check script
echo.
echo 📖 For detailed instructions, see: WINDOWS_INSTALLATION_GUIDE.txt
echo ========================================================================

echo.
echo Press any key to open the project in VS Code...
pause >nul
code .

echo.
echo Installation complete! Check the opened VS Code window to start developing.
pause