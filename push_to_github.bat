@echo off
title Push Roadway to GitHub
cd /d "%~dp0"
echo ======================================================================
echo Pushing Roadway Logistics Group to GitHub
echo Repo: https://github.com/harrybmlogistics-droid/Roadway.git
echo ======================================================================
echo.
echo Running git push -u origin main...
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ======================================================================
    echo [SUCCESS] Your code is live on GitHub!
    echo URL: https://github.com/harrybmlogistics-droid/Roadway
    echo ======================================================================
) else (
    echo ======================================================================
    echo [INFO] If prompted above, sign in with your GitHub browser login
    echo or paste your GitHub Personal Access Token.
    echo ======================================================================
)
echo.
pause
