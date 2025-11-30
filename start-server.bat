@echo off
echo ========================================
echo   Iniciando servidor local...
echo ========================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no está instalado.
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Iniciar servidor
echo Iniciando servidor en http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
node server.js

pause
