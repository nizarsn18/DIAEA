@echo off
chcp 65001 > nul
title Push vers GitHub

set "PATH=%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;C:\Program Files\nodejs;%AppData%\npm;C:\Program Files\Git\cmd;C:\Program Files\Git\bin;C:\Program Files (x86)\Git\cmd;C:\Users\hp\AppData\Local\Programs\Git\cmd;%PATH%"

echo ========================================================
echo   ENVOI DES MODIFICATIONS SUR GITHUB (nizarsn18/DIAEA)
echo ========================================================
echo.

cd /d "%~dp0"

echo Configuration de l'identite Git...
git config user.email "nizarsn18@gmail.com"
git config user.name "nizarsn18"

echo [1/4] Recompilation du Frontend...
cd frontend
call npm run build
xcopy /E /Y /I dist\* ..\
cd ..

echo [2/4] Ajout des fichiers (git add .)...
git add .

echo [3/4] Creation du commit...
git commit -m "Fix React Router et connexion instantanee" 2>nul

echo [4/4] Envoi et synchronisation vers GitHub...
git push -u origin main --force

echo.
echo ========================================================
echo   SUCCES TOTAL ! Le code est pousse sur GitHub !
echo   Votre site est mis a jour sur :
echo   https://nizarsn18.github.io/DIAEA/
echo ========================================================
echo.
pause
