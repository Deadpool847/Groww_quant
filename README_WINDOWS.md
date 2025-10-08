# 🚀 BlackRock Aladdin Trading Platform - Windows Setup

## Quick Start (Recommended)

1. **Download and Extract** the project to `C:\AladdinTrading\`
2. **Right-click** on `install_aladdin.bat` and select **"Run as Administrator"**
3. **Follow the prompts** in the installation window
4. **Start the application:**
   - Run `start_services.bat` (starts databases)
   - Run `start_backend.bat` (starts API server)
   - Run `start_frontend.bat` (starts web interface)
5. **Open** http://localhost:3000 in your browser

## What You Get

✅ **Professional Trading Platform** - Full BlackRock Aladdin clone  
✅ **Real-time Market Data** - Integrated with Groww API  
✅ **Portfolio Management** - Advanced analytics and risk management  
✅ **Order Management** - Place, modify, and track orders  
✅ **Risk Analytics** - VaR, stress testing, correlation analysis  
✅ **Performance Analytics** - Attribution analysis and benchmarking  

## Prerequisites (Auto-installed)

The installer will check and guide you to install:
- Python 3.11+ (with PATH configured)
- Node.js 18+ LTS
- Git for Windows
- Visual Studio Code (recommended)
- Redis for Windows
- MongoDB Community Edition

## Project Structure

```
AladdinTrading/
├── install_aladdin.bat          # 🛠️ Main installer script
├── start_backend.bat            # 🚀 Start API server
├── start_frontend.bat           # 🌐 Start web interface  
├── start_services.bat           # 🔧 Start Redis & MongoDB
├── check_services.bat           # ✅ Health check all services
├── quick_test.bat               # 🧪 Test functionality
├── open_vscode.bat              # 📝 Open in VS Code
├── uninstall_aladdin.bat        # 🗑️ Clean uninstaller
├── WINDOWS_INSTALLATION_GUIDE.txt  # 📖 Detailed guide
├── backend/                     # 🐍 Python FastAPI backend
│   ├── main.py                  # Main application
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Configuration (add your API keys here)
│   └── ...
└── frontend/                    # ⚛️ React frontend
    ├── src/                     # Source code
    ├── package.json             # Node.js dependencies
    └── ...
```

## API Credentials Setup

1. **Sign up for Groww API** (₹499/month)
2. **Get your credentials** from Groww dashboard
3. **Edit** `backend\.env` file:
   ```
   GROWW_API_KEY=your_actual_api_key
   GROWW_API_SECRET=your_actual_api_secret  
   GROWW_TOTP_SEED=your_totp_seed
   GROWW_ALLOWED_IP=your_ip_address
   ```

## Available Scripts

| Script | Purpose |
|--------|---------|
| `install_aladdin.bat` | 🛠️ Complete installation and setup |
| `start_services.bat` | 🔧 Start Redis and MongoDB services |
| `start_backend.bat` | 🚀 Start the API server (port 8001) |
| `start_frontend.bat` | 🌐 Start the web interface (port 3000) |
| `check_services.bat` | ✅ Check all services health status |
| `quick_test.bat` | 🧪 Test all API endpoints |
| `open_vscode.bat` | 📝 Open project in VS Code |
| `uninstall_aladdin.bat` | 🗑️ Clean removal of components |

## Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001  
- **API Documentation:** http://localhost:8001/api/docs
- **Health Check:** http://localhost:8001/health

## Troubleshooting

### Common Issues

1. **"Python not found"**
   - Reinstall Python with "Add to PATH" checked
   - Restart Command Prompt

2. **"Permission denied"**
   - Run scripts as Administrator
   - Check Windows Defender settings

3. **"Port already in use"**
   - Check running processes: `netstat -ano | findstr :8001`
   - Kill process: `taskkill /PID <PID> /F`

4. **Services not starting**
   - Run `start_services.bat` as Administrator
   - Check Windows Services for Redis/MongoDB

### Get Help

1. **Run diagnostics:** `check_services.bat`
2. **Check logs:** Look in `backend\logs\` folder
3. **Test components:** Run `quick_test.bat`
4. **Read detailed guide:** `WINDOWS_INSTALLATION_GUIDE.txt`

## Development Workflow

### Using VS Code (Recommended)
1. Run `open_vscode.bat`
2. Press `Ctrl+`` to open terminal
3. Backend: `cd backend` → `venv\Scripts\activate` → `python main.py`
4. Frontend: New terminal → `cd frontend` → `yarn start`

### Manual Start
1. Start databases: `start_services.bat`
2. Start backend: `start_backend.bat`  
3. Start frontend: `start_frontend.bat`
4. Open http://localhost:3000

## Features

### 📊 Dashboard
- Real-time portfolio overview
- Market indices and sector performance
- Key performance metrics

### 💼 Portfolio Management  
- Multiple portfolio support
- Holdings analysis and allocation
- Performance tracking vs benchmarks

### 📈 Risk Analytics
- Value at Risk (VaR) calculations
- Stress testing scenarios
- Correlation analysis
- Drawdown analysis

### 📋 Order Management
- Place market and limit orders
- Order status tracking
- Order history and analytics

### 📊 Performance Analytics
- Performance attribution
- Benchmark comparison
- Monthly return analysis
- Risk-adjusted metrics

## Support

For technical issues:
1. Check the detailed installation guide
2. Run the health check script
3. Review error logs in the backend/logs folder
4. Verify all prerequisites are installed

---

**Ready to start trading like BlackRock? Run the installer and begin your journey! 🚀**