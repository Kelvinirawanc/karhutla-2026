@echo off
setlocal
cd /d %~dp0
start "" http://localhost:8001/
python -m http.server 8001
