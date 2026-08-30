@echo off
chcp 65001 > nul
title Compilation du Frontend React

set "PATH=%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;C:\Program Files\nodejs;%AppData%\npm;%PATH%"

echo ========================================================
echo   COMPILATION DU FRONTEND REACT (Vite)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Compilation avec Vite (npm run build)...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo [ERREUR] La compilation npm run build a echoue.
    pause
    exit /b 1
)

echo.
echo [2/2] Mise a jour des fichiers static du projet...
xcopy /E /Y /I dist\* ..\

echo.
echo ========================================================
echo   COMPILATION REUSSIE !
echo   Les nouveaux fichiers bundles sont ajoutes au projet.
echo ========================================================
echo.
pause
