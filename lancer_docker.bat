@echo off
chcp 65001 > nul
echo ========================================================
echo   Lancement avec Docker Compose - DIAEA Parc Info
echo ========================================================
echo.

set "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%"

echo Lancement des conteneurs Docker (MySQL + Backend + Frontend)...
docker-compose up --build -d

echo.
echo Patienter pendant le demarrage des conteneurs...
timeout /t 5 > nul

echo.
echo Ouverture du Frontend sur http://localhost ...
start http://localhost

echo.
echo ========================================================
echo   Conteneurs Docker demarres !
echo   - Frontend : http://localhost
echo   - Backend : http://localhost:8080/api
echo ========================================================
echo.
pause
