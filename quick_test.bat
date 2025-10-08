@echo off
:: Quick Test of Aladdin Trading Platform
title Aladdin Quick Test

color 06
echo ========================================================================
echo                    ALADDIN QUICK FUNCTIONALITY TEST
echo ========================================================================
echo.

:: Check if curl is available
where curl >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] curl command not found!
    echo Please install curl or use Windows 10+ which includes curl by default
    pause
    exit /b 1
)

echo [TEST 1/6] Backend Health Check
echo Testing: http://localhost:8001/health
curl -s -w "Status: %%{http_code}\n" http://localhost:8001/health
echo.

echo [TEST 2/6] API Documentation  
echo Testing: http://localhost:8001/api/docs
curl -s -I http://localhost:8001/api/docs | findstr "200 OK"
if %errorlevel% equ 0 (
    echo ✅ API Documentation accessible
) else (
    echo ❌ API Documentation not accessible
)
echo.

echo [TEST 3/6] Portfolio API
echo Testing: http://localhost:8001/api/v1/portfolio/
curl -s "http://localhost:8001/api/v1/portfolio/" | findstr "portfolios"
if %errorlevel% equ 0 (
    echo ✅ Portfolio API working
) else (
    echo ❌ Portfolio API not working
)
echo.

echo [TEST 4/6] Market Data API
echo Testing: http://localhost:8001/api/v1/market/overview
curl -s "http://localhost:8001/api/v1/market/overview" | findstr "indices"
if %errorlevel% equ 0 (
    echo ✅ Market Data API working  
) else (
    echo ❌ Market Data API not working
)
echo.

echo [TEST 5/6] Orders API
echo Testing: http://localhost:8001/api/v1/orders/
curl -s "http://localhost:8001/api/v1/orders/" | findstr "orders"
if %errorlevel% equ 0 (
    echo ✅ Orders API working
) else (
    echo ❌ Orders API not working  
)
echo.

echo [TEST 6/6] Frontend Application
echo Testing: http://localhost:3000
curl -s -I http://localhost:3000 | findstr "200 OK" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend accessible
    echo Opening frontend in browser...
    start http://localhost:3000
) else (
    echo ❌ Frontend not accessible
    echo Make sure to run start_frontend.bat first
)
echo.

echo ========================================================================
echo                           TEST SUMMARY
echo ========================================================================
echo.
echo If all tests passed:
echo   🎉 Your Aladdin Trading Platform is working perfectly!
echo   📊 Access the application at: http://localhost:3000
echo   🔧 API documentation at: http://localhost:8001/api/docs
echo.
echo If any tests failed:
echo   🔍 Run check_services.bat for detailed diagnostics
echo   📖 Check WINDOWS_INSTALLATION_GUIDE.txt for troubleshooting
echo   🚀 Ensure all services are started with start_services.bat
echo.

pause