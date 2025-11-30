/**
 * Módulo de Interfaz de Usuario
 * Maneja modales, mensajes y elementos de UI
 */

import { CONFIG, STORY_MESSAGES, FAIL_MESSAGES } from './config.js';

let isPaused = false;

// Cargar número de teléfono (prioridad: API de Vercel > archivo privado local)
(async () => {
    // Si ya está configurado desde variable de entorno, no hacer nada
    if (CONFIG.PHONE_NUMBER) {
        return;
    }
    
    // En producción (Vercel), intentar cargar desde API o archivo JSON
    const isProduction = window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1' &&
                         !window.location.hostname.startsWith('192.168.');
    
    if (isProduction) {
        // Intentar primero desde API (variable de entorno)
        try {
            const response = await fetch('/api/config');
            if (response.ok) {
                const data = await response.json();
                if (data.phoneNumber) {
                    CONFIG.PHONE_NUMBER = data.phoneNumber;
                    return;
                }
            }
        } catch (e) {
            // Si falla la API, intentar desde archivo JSON
            try {
                const jsonResponse = await fetch('/config.json');
                if (jsonResponse.ok) {
                    const jsonData = await jsonResponse.json();
                    if (jsonData.phoneNumber) {
                        CONFIG.PHONE_NUMBER = jsonData.phoneNumber;
                        return;
                    }
                }
            } catch (e2) {
                console.warn('No se pudo cargar el número. Configura VERCEL_PHONE_NUMBER en Vercel o edita /config.json');
            }
        }
    }
    
    // En desarrollo local, intentar cargar desde archivo privado
    try {
        const privateConfig = await import('./config.private.js');
        if (privateConfig.PRIVATE_CONFIG?.PHONE_NUMBER) {
            CONFIG.PHONE_NUMBER = privateConfig.PRIVATE_CONFIG.PHONE_NUMBER;
        }
    } catch (e) {
        // Archivo privado no existe
        if (!isProduction) {
            console.warn('config.private.js no encontrado. Crea el archivo basándote en config.private.example.js');
        }
    }
})();

/**
 * Muestra un modal con un mensaje
 */
export function showModal(text, isDeath, isFinal) {
    isPaused = true;
    const modal = document.getElementById('message-modal');
    const content = document.getElementById('modal-content');
    const actions = document.getElementById('modal-actions');

    content.innerText = text;
    actions.innerHTML = "";

    if (isFinal) {
        // Botón WhatsApp (solo si el número está configurado)
        const currentPhone = CONFIG.PHONE_NUMBER;
        if (currentPhone && currentPhone !== "CONFIGURAR_EN_PRIVATE") {
            const btn = document.createElement('a');
            btn.className = "action-btn wa-btn";
            btn.innerText = "💬 HABLAR CON PAPÁ";
            btn.href = `https://wa.me/${currentPhone}?text=Hola%20pa,%20llegué%20al%20final%20del%20juego.%20Gracias%20por%20todo.`;
            btn.target = "_blank";
            actions.appendChild(btn);
        }

        // Botón para reiniciar
        const restartBtn = document.createElement('button');
        restartBtn.className = "action-btn";
        restartBtn.style.background = "linear-gradient(135deg, #ff0055 0%, #ff3366 100%)";
        restartBtn.style.color = "white";
        restartBtn.style.marginTop = "10px";
        restartBtn.innerText = "JUGAR DE NUEVO";
        restartBtn.onclick = () => {
            location.reload();
        };
        actions.appendChild(restartBtn);
            } else if (isDeath) {
                // Botón Reintentar (solo si hay vidas)
                const livesEl = document.getElementById('lives-display');
                const lives = livesEl ? parseInt(livesEl.innerText) || 0 : 0;
                
                if (lives > 0) {
                    const btn = document.createElement('button');
                    btn.className = "action-btn";
                    btn.style.background = "linear-gradient(135deg, #ff0055 0%, #ff3366 100%)";
                    btn.style.color = "white";
                    btn.innerText = `CONTINUAR (${lives} vidas restantes)`;
                    btn.onclick = () => {
                        modal.style.display = 'none';
                        isPaused = false;
                        // Disparar evento personalizado para respawn
                        window.dispatchEvent(new CustomEvent('playerRespawn'));
                    };
                    actions.appendChild(btn);
                } else {
                    const btn = document.createElement('button');
                    btn.className = "action-btn";
                    btn.style.background = "linear-gradient(135deg, #ff0055 0%, #ff3366 100%)";
                    btn.style.color = "white";
                    btn.innerText = "REINICIAR JUEGO";
                    btn.onclick = () => {
                        location.reload();
                    };
                    actions.appendChild(btn);
                }
                
                // Siempre agregar botón de reinicio de emergencia
                const emergencyBtn = document.createElement('button');
                emergencyBtn.className = "action-btn";
                emergencyBtn.style.background = "linear-gradient(135deg, #666 0%, #888 100%)";
                emergencyBtn.style.color = "white";
                emergencyBtn.style.marginTop = "10px";
                emergencyBtn.innerText = "🔄 REINICIAR (EMERGENCIA)";
                emergencyBtn.onclick = () => {
                    location.reload();
                };
                actions.appendChild(emergencyBtn);
    } else {
        // Botón Continuar (Historia)
        const btn = document.createElement('button');
        btn.className = "action-btn";
        btn.innerText = "CONTINUAR >>";
        btn.onclick = () => {
            modal.style.display = 'none';
            isPaused = false;
        };
        actions.appendChild(btn);
    }
    modal.style.display = 'block';
    return false;
}

/**
 * Verifica si el juego está pausado
 */
export function getIsPaused() {
    return isPaused;
}

/**
 * Establece el estado de pausa
 */
export function setIsPaused(value) {
    isPaused = value;
}

/**
 * Muestra un mensaje de fallo aleatorio
 */
export function showFailMessage() {
    const msg = FAIL_MESSAGES[Math.floor(Math.random() * FAIL_MESSAGES.length)];
    showModal(msg, true, false);
}

/**
 * Verifica y muestra mensajes de la historia
 */
export function checkStoryMessages(playerX) {
    STORY_MESSAGES.forEach(msg => {
        if (!msg.shown && playerX >= msg.x) {
            msg.shown = true;
            showModal(msg.text, false, msg.isFinal);
            return msg.isFinal;
        }
    });
    return false;
}

/**
 * Actualiza la barra de progreso
 */
export function updateProgressBar(progress) {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = Math.min(100, progress) + '%';
}

/**
 * Actualiza el score en la UI
 */
export function updateScore(score) {
    const scoreDisplay = document.getElementById('score-display');
    scoreDisplay.innerText = score;
}

/**
 * Actualiza las vidas en la UI
 */
export function updateLives(lives) {
    let livesDisplay = document.getElementById('lives-display');
    if (!livesDisplay) {
        // Crear display de vidas si no existe
        const uiLayer = document.getElementById('ui-layer');
        const livesSection = document.createElement('div');
        livesSection.className = 'ui-section';
        livesSection.style.textAlign = 'center';
        livesSection.innerHTML = `
            <div class="ui-label">VIDAS</div>
            <div id="lives-display" class="ui-value">${lives}</div>
        `;
        uiLayer.appendChild(livesSection);
        livesDisplay = document.getElementById('lives-display');
    }
    livesDisplay.innerText = lives;
    livesDisplay.style.color = lives > 1 ? '#00d2ff' : '#ff0055';
}

/**
 * Inicializa los controles de la UI
 */
export function initUI() {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const rotateNotice = document.getElementById('rotate-notice');

    // Ajustar aviso de rotación
    function checkOrientation() {
        if (window.innerHeight > window.innerWidth) {
            rotateNotice.style.display = 'block';
        } else {
            rotateNotice.style.display = 'none';
        }
    }

    window.addEventListener('resize', checkOrientation);
    checkOrientation();

    return {
        startScreen,
        startBtn
    };
}
