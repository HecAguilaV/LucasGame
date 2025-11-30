/**
 * Punto de entrada principal del juego
 * Inicializa todos los módulos y configura los eventos
 */

import { Game } from './game.js';
import { initUI } from './ui.js';
import { initStars, initMeteors } from './level.js';

// Inicializar estrellas de fondo y meteoritos
initStars();
initMeteors();

// Obtener elementos del DOM
const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

// Inicializar juego primero
game.init();

// Inicializar UI después
const { startScreen, startBtn } = initUI();

// Configurar controles
function jump() {
    if (game.gameRunning) {
        game.handleJump();
    }
}

// Solo prevenir default en touchstart si NO es el botón de inicio o la pantalla de inicio
window.addEventListener('touchstart', (e) => {
    // No prevenir si es el botón de inicio, la pantalla de inicio o un elemento interactivo
    if (e.target.id === 'start-btn' || 
        e.target.closest('#start-screen') || 
        e.target.closest('#start-btn') ||
        e.target.closest('.action-btn') ||
        !game.gameRunning) {
        return;
    }
    e.preventDefault();
    jump();
}, { passive: false });

// Solo saltar con mousedown si el juego está corriendo
window.addEventListener('mousedown', (e) => {
    // No saltar si es el botón de inicio o la pantalla de inicio
    if (e.target.id === 'start-btn' || e.target.closest('#start-screen') || !game.gameRunning) {
        return;
    }
    jump();
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
    }
});

// Botón de inicio - Función simple y directa
function startGame(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    console.log('Botón de inicio presionado');
    if (startScreen) {
        startScreen.style.display = 'none';
    }
    if (game) {
        game.start();
    }
}

// Configurar botón de inicio de forma simple y directa
if (startBtn) {
    // Usar onclick directo (más confiable)
    startBtn.onclick = startGame;
    
    // También agregar listeners de eventos para móvil
    startBtn.addEventListener('click', startGame, true);
    startBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        startGame(e);
    }, { passive: false, capture: true });
} else {
    console.error('startBtn no encontrado');
    // Reintentar después de un momento
    setTimeout(() => {
        const btn = document.getElementById('start-btn');
        if (btn) {
            btn.onclick = startGame;
            btn.addEventListener('click', startGame, true);
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                startGame(e);
            }, { passive: false, capture: true });
        }
    }, 500);
}

// Prevenir scroll en móviles
document.addEventListener('touchmove', (e) => {
    if (game.gameRunning) {
        e.preventDefault();
    }
}, { passive: false });

// Escuchar evento de respawn
window.addEventListener('playerRespawn', () => {
    game.respawn();
});
