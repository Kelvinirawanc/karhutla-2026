@echo off
setlocal
cd /d %~dp0

echo ============================================
echo KARHUTLA INDONESIA 2026 - DATA SCRAPER
echo ============================================
echo.

where python >nul 2>nul
if errorlevel 1 (
    echo Python was not found.
    echo Install Python 3.10+ and make sure Add Python to PATH is enabled.
    pause
    exit /b 1
)

echo [1/2] Installing / checking requirements...
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
)

echo.
echo [2/2] Running Karhutla scraper...
python scraper\scrape_karhutla_2026.py
if errorlevel 1 (
    echo.
    echo SCRAPER FAILED.
    pause
    exit /b 1
)

echo.
echo SCRAPER COMPLETED.
echo Open the dashboard with open_dashboard.bat
pause
