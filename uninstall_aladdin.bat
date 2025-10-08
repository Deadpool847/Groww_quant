@echo off
:: Uninstall Aladdin Trading Platform
title Aladdin Uninstaller

color 0C
echo ========================================================================
echo                    ALADDIN TRADING PLATFORM UNINSTALLER  
echo ========================================================================
echo.
echo This will remove the Aladdin Trading Platform installation.
echo.
echo WARNING: This will delete:
echo   • Python virtual environment and packages
echo   • Frontend node_modules and dependencies  
echo   • Generated configuration files
echo   • Application logs and cache
echo.
echo Your custom .env files and data will be preserved.
echo.
set /p confirm=Are you sure you want to uninstall? (y/N): 
if /i not "%confirm%"=="y" (
    echo Uninstall cancelled.
    pause
    exit /b 0
)

echo.
echo [STEP 1/6] Stopping running services...

:: Stop backend if running
echo Stopping backend server...
tasklist | findstr "python.exe" >nul 2>&1 && taskkill /f /im python.exe >nul 2>&1
echo ✅ Backend processes stopped

:: Stop frontend if running  
echo Stopping frontend server...
tasklist | findstr "node.exe" >nul 2>&1 && taskkill /f /im node.exe >nul 2>&1
echo ✅ Frontend processes stopped
echo.

echo [STEP 2/6] Removing Python virtual environment...
cd /d "%~dp0backend"
if exist venv (
    rmdir /s /q venv
    echo ✅ Python virtual environment removed
) else (
    echo ℹ️  No virtual environment found
)
echo.

echo [STEP 3/6] Removing frontend dependencies...
cd /d "%~dp0frontend" 
if exist node_modules (
    echo This may take a moment...
    rmdir /s /q node_modules >nul 2>&1
    echo ✅ Frontend dependencies removed
) else (
    echo ℹ️  No frontend dependencies found
)

if exist yarn.lock (
    del yarn.lock
    echo ✅ Yarn lock file removed
)

if exist package-lock.json (
    del package-lock.json  
    echo ✅ NPM lock file removed
)
echo.

echo [STEP 4/6] Cleaning temporary files...
cd /d "%~dp0"

:: Remove logs
if exist backend\logs (
    rmdir /s /q backend\logs
    echo ✅ Log files removed
)

:: Remove VS Code workspace files
if exist .vscode (
    rmdir /s /q .vscode
    echo ✅ VS Code configuration removed  
)

:: Remove Python cache
for /r . %%d in (__pycache__) do (
    if exist "%%d" rmdir /s /q "%%d" >nul 2>&1
)
echo ✅ Python cache files removed

:: Remove generated batch files
if exist start_backend.bat del start_backend.bat
if exist start_frontend.bat del start_frontend.bat
if exist start_services.bat del start_services.bat
if exist check_services.bat del check_services.bat
if exist open_vscode.bat del open_vscode.bat
if exist quick_test.bat del quick_test.bat
echo ✅ Generated scripts removed
echo.

echo [STEP 5/6] Preserving user configuration...
echo ℹ️  Keeping .env files (contains your API credentials)
echo ℹ️  Keeping source code and project files
echo ℹ️  Keeping installation guide and documentation
echo.

echo [STEP 6/6] Final cleanup...
:: Remove this uninstaller last
echo ℹ️  Note: This uninstaller will remain - delete manually if needed
echo.

echo ========================================================================
echo                         UNINSTALL COMPLETE
echo ========================================================================
echo.
echo ✅ Aladdin Trading Platform components removed successfully
echo.
echo PRESERVED FILES:
echo   📄 Source code (backend/ and frontend/ folders)
echo   🔧 Configuration files (.env)
echo   📖 Documentation files
echo   🛠️  This uninstaller (delete manually if needed)
echo.
echo TO REINSTALL:
echo   🚀 Run install_aladdin.bat to reinstall all components
echo   📝 Your API credentials in .env files will be preserved
echo.
echo TO COMPLETELY REMOVE:
echo   🗑️  Manually delete the entire project folder
echo   🧹  Remove Redis and MongoDB if no longer needed
echo.

pause