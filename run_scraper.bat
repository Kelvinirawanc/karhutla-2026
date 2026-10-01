@echo off
setlocal
cd /d %~dp0
echo ============================================================
echo KARHUTLA INDONESIA 2026 - SCRAPER
echo ============================================================
where python >nul 2>nul
if errorlevel 1 (echo Python not found. Please install Python 3.10+ and add to PATH.&pause&exit /b 1)
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if errorlevel 1 (echo Dependency installation failed.&pause&exit /b 1)
python scraper\scrape_karhutla_2026.py
if errorlevel 1 (echo SCRAPER FAILED.&pause&exit /b 1)
echo Scraper completed. Run open_dashboard.bat
pause
