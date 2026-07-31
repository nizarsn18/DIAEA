@echo off
chcp 65001 > nul
title Lancement DIAEA Parc Info

:: Ajouter System32 et PowerShell au PATH du script
set "PATH=%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;%PATH%"

echo ========================================================
echo   Lancement du Projet DIAEA - Parc Informatique
echo ========================================================
echo.

set "PROJECT_DIR=%~dp0"
set "BACKEND_DIR=%PROJECT_DIR%backend"
set "FRONTEND_DIR=%PROJECT_DIR%frontend"

echo [1/2] Lancement du Backend Spring Boot (Port 8080)...
start "DIAEA Backend" cmd /k "cd /d %BACKEND_DIR% && mvnw.cmd spring-boot:run"

echo [2/2] Lancement du Frontend React (Port 5173)...
start "DIAEA Frontend" cmd /k "cd /d %FRONTEND_DIR% && npm run dev"

echo.
echo ========================================================
echo   Les 2 fenetres de terminal sont lancées.
echo   Gardez-les ouvertes !
echo.
echo   Attente de 12 secondes puis ouverture du navigateur...
echo ========================================================
timeout /t 12 > nul

start http://localhost:5173
pause
