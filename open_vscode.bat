@echo off
:: Open Aladdin Trading Platform in VS Code
title Opening Aladdin in VS Code

color 0C
echo ========================================================================
echo                    OPENING ALADDIN IN VS CODE
echo ========================================================================
echo.

:: Check if VS Code is installed
where code >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] VS Code 'code' command not found!
    echo.
    echo Please ensure VS Code is installed and added to PATH:
    echo   1. Download VS Code from: https://code.visualstudio.com/
    echo   2. During installation, check "Add to PATH"
    echo   3. Restart your command prompt
    echo.
    echo Alternative: Open VS Code manually and use File → Open Folder
    echo Then navigate to: %~dp0
    pause
    exit /b 1
)

echo [INFO] Opening Aladdin Trading Platform in VS Code...
echo.
echo 📁 Project Directory: %~dp0
echo.

:: Create VS Code workspace settings if they don't exist
if not exist .vscode mkdir .vscode

:: Create settings.json for optimal development experience
echo [INFO] Configuring VS Code workspace settings...
(
echo {
echo   "python.defaultInterpreterPath": "./backend/venv/Scripts/python.exe",
echo   "python.formatting.provider": "black",
echo   "editor.formatOnSave": true,
echo   "editor.codeActionsOnSave": {
echo     "source.organizeImports": true
echo   },
echo   "python.linting.enabled": true,
echo   "python.linting.pylintEnabled": false,
echo   "python.linting.flake8Enabled": true,
echo   "files.associations": {
echo     "*.jsx": "javascriptreact"
echo   },
echo   "emmet.includeLanguages": {
echo     "javascriptreact": "html"
echo   },
echo   "terminal.integrated.shell.windows": "cmd.exe"
echo }
) > .vscode\settings.json

:: Create launch.json for debugging
(
echo {
echo   "version": "0.2.0",
echo   "configurations": [
echo     {
echo       "name": "Python: FastAPI Backend",
echo       "type": "python",
echo       "request": "launch", 
echo       "program": "${workspaceFolder}/backend/main.py",
echo       "console": "integratedTerminal",
echo       "cwd": "${workspaceFolder}/backend",
echo       "env": {
echo         "PYTHONPATH": "${workspaceFolder}/backend"
echo       }
echo     },
echo     {
echo       "name": "Launch Frontend",
echo       "type": "node",
echo       "request": "launch",
echo       "program": "${workspaceFolder}/frontend/node_modules/.bin/craco",
echo       "args": ["start"],
echo       "cwd": "${workspaceFolder}/frontend",
echo       "console": "integratedTerminal"
echo     }
echo   ]
echo }
) > .vscode\launch.json

:: Create tasks.json for common tasks
(
echo {
echo   "version": "2.0.0",
echo   "tasks": [
echo     {
echo       "label": "Start Backend",
echo       "type": "shell",
echo       "command": "python",
echo       "args": ["main.py"],
echo       "options": {
echo         "cwd": "${workspaceFolder}/backend"
echo       },
echo       "group": "build",
echo       "presentation": {
echo         "echo": true,
echo         "reveal": "always",
echo         "focus": false,
echo         "panel": "new"
echo       }
echo     },
echo     {
echo       "label": "Start Frontend", 
echo       "type": "shell",
echo       "command": "yarn",
echo       "args": ["start"],
echo       "options": {
echo         "cwd": "${workspaceFolder}/frontend"
echo       },
echo       "group": "build",
echo       "presentation": {
echo         "echo": true,
echo         "reveal": "always", 
echo         "focus": false,
echo         "panel": "new"
echo       }
echo     }
echo   ]
echo }
) > .vscode\tasks.json

echo ✅ VS Code workspace configured
echo.

:: Open VS Code with the project
echo [INFO] Launching VS Code...
code .

:: Check if VS Code opened successfully
timeout /t 2 >nul
tasklist | findstr "Code.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ VS Code opened successfully!
    echo.
    echo 🔧 DEVELOPMENT TIPS:
    echo   • Press Ctrl+` to open integrated terminal
    echo   • Use Ctrl+Shift+P for command palette
    echo   • Press F5 to start debugging backend
    echo   • Use Ctrl+Shift+` for new terminal
    echo.
    echo 📁 IMPORTANT FILES:
    echo   • backend/main.py - Main FastAPI application
    echo   • frontend/src/App.js - Main React component
    echo   • backend/.env - Configuration file (add your API keys here)
    echo.
    echo 🚀 TO START DEVELOPING:
    echo   1. Open terminal in VS Code (Ctrl+`)
    echo   2. Navigate to backend: cd backend
    echo   3. Activate environment: venv\Scripts\activate
    echo   4. Start backend: python main.py
    echo   5. Open new terminal for frontend: cd frontend
    echo   6. Start frontend: yarn start
) else (
    echo ⚠️  VS Code may have opened in background
    echo Check your taskbar for VS Code window
)
echo.

echo ========================================================================
echo               VS CODE OPENED - READY FOR DEVELOPMENT!
echo ========================================================================

pause