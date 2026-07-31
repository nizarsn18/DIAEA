@echo off
chcp 65001 > nul
title Push vers GitHub

set "PATH=%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;C:\Program Files\Git\cmd;C:\Program Files\Git\bin;C:\Program Files (x86)\Git\cmd;C:\Users\hp\AppData\Local\Programs\Git\cmd;%PATH%"

echo ========================================================
echo   ENVOI DES MODIFICATIONS SUR GITHUB (nizarsn18/DIAEA)
echo ========================================================
echo.

cd /d "%~dp0"

echo Configuration de l'identite Git...
git config user.email "nizarsn18@gmail.com"
git config user.name "nizarsn18"

echo [1/3] Ajout des fichiers...
git add .

echo [2/3] Verification du commit...
git commit -m "Fix React Router et redirection login" 2>nul

echo [3/3] Envoi et synchronisation vers GitHub...
git push -u origin main --force

echo.
echo ========================================================
echo   SUCCES TOTAL ! Le code est pousse sur GitHub !
echo   Votre site est en cours de deploiment sur :
echo   https://nizarsn18.github.io/DIAEA/
echo ========================================================
echo.
pause
