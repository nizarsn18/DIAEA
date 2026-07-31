@echo off
setlocal enableextensions enabledelayedexpansion

:: Auto-detection de JAVA_HOME si Java 17 est installe
if exist "C:\Program Files\Java\jdk-17.0.12" set "JAVA_HOME=C:\Program Files\Java\jdk-17.0.12"
if exist "C:\Program Files\Java\jdk-17" set "JAVA_HOME=C:\Program Files\Java\jdk-17"
for /d %%D in ("C:\Program Files\Java\jdk-17*") do set "JAVA_HOME=%%D"

set "USER_MVN=C:\Users\hp\Downloads\maven-mvnd-1.0.5-windows-amd64 (1)\maven-mvnd-1.0.5-windows-amd64\bin\mvnd.cmd"

if exist "%USER_MVN%" call "%USER_MVN%" %* & exit /b !ERRORLEVEL!

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERREUR] Maven introuvable.
pause

