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

echo [1/3] Ajout des fichiers (git add .)...
git add .

echo [2/3] Creation du commit...
git commit -m "Fix React Router et redirection login"

echo [3/3] Envoi vers votre depot (https://github.com/nizarsn18/DIAEA.git)...
git push origin main

echo.
echo ========================================================
echo   Mise a jour envoyee avec succes !
echo   Votre site sera a jour dans 30 secondes sur :
echo   https://nizarsn18.github.io/DIAEA/
echo ========================================================
echo.
pause
