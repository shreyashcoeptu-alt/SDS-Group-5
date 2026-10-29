@echo off
title Push Student 1 Branch to GitHub
echo ========================================================
echo   Push "feature/student-1-auth" to GitHub
echo ========================================================
echo.
echo Make sure you have created a repository on GitHub:
echo https://github.com/new
echo.
set /p REPO_URL="Enter your GitHub Repo URL (e.g. https://github.com/your-username/repo.git): "

if "%REPO_URL%"=="" (
    echo Error: No URL provided.
    pause
    exit /b
)

echo.
echo Configuring remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo Pushing branch "feature/student-1-auth" to GitHub...
git push -u origin feature/student-1-auth

echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo SUCCESS! Your branch "feature/student-1-auth" is now on GitHub!
    echo You can now create a Pull Request on GitHub to merge into main.
) else (
    echo Push failed. Please check your GitHub credentials or repo URL.
)
echo ========================================================
echo.
pause
