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

// Inicializar UI
const { startScreen, startBtn } = initUI();

// Inicializar juego
game.init();

// Configurar controles
function jump() {
    game.handleJump();
}

window.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
}, { passive: false });

window.addEventListener('mousedown', jump);

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
    }
});

// Botón de inicio
startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startScreen.style.display = 'none';
    game.start();
});

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
