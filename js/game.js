/**
 * Módulo Principal del Juego
 * Coordina todos los sistemas del juego
 */

import { CONFIG } from './config.js';
import { Player } from './player.js';
import { initLevel, getPlatforms, getSpikes, getRamps, drawBackground, drawPlatforms, drawSpikes, drawRamps, drawPortal } from './level.js';
import { updateParticles, drawParticles, createConfetti, createJumpParticles } from './particles.js';
import { showFailMessage, checkStoryMessages, updateProgressBar, updateScore, getIsPaused, setIsPaused, updateLives } from './ui.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = new Player();
        this.cameraX = 0;
        this.gameRunning = false;
        this.score = 0;
        this.lives = CONFIG.LIVES;
    }

    /**
     * Inicializa el juego
     */
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Ajusta el tamaño del canvas
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Inicia el juego
     */
    start() {
        this.gameRunning = true;
        this.lives = CONFIG.LIVES;
        initLevel(this.canvas.height);
        this.player.init(this.canvas.height);
        this.cameraX = 0;
        this.score = 0;
        updateLives(this.lives);
        this.loop();
    }

    /**
     * Actualiza la lógica del juego
     */
    update() {
        // Si el juego no está corriendo o está pausado, no actualizar
        if (!this.gameRunning || getIsPaused()) return;
        
        // Con vidas infinitas, nunca se detiene por falta de vidas
        // (se mantiene la lógica por si en el futuro se quiere limitar)

        // Actualizar jugador
        this.player.update(CONFIG.GRAVITY, CONFIG.GAME_SPEED);
        this.score = Math.floor(this.player.x / 10);
        updateScore(this.score);

        // Actualizar barra de progreso
        const progress = (this.player.x / CONFIG.FINAL_DISTANCE) * 100;
        updateProgressBar(progress);

        // Actualizar partículas
        updateParticles();
        
        // Actualizar meteoritos (se actualizan en drawMeteors)

        // Colisiones con plataformas
        this.player.checkPlatformCollisions(getPlatforms());

        // Colisiones con rampas (impulsores)
        getRamps().forEach(r => {
            if (this.player.x + this.player.size > r.x &&
                this.player.x < r.x + r.w &&
                this.player.y + this.player.size > r.y &&
                this.player.y < r.y + r.h &&
                this.player.dy >= 0) {
                this.player.dy = r.power; // Impulso hacia arriba
                createJumpParticles(this.player.x, this.player.y, this.player.size);
            }
        });

        // Colisiones con pinchos
        if (this.player.checkSpikeCollisions(getSpikes())) {
            this.handleDeath();
            return;
        }

        // Verificar caída al vacío (solo si cae completamente fuera de la pantalla)
        if (this.player.checkFall(this.canvas.height)) {
            this.handleDeath();
            return;
        }

        // Verificar si el jugador está cayendo en un hoyo (solo cuando está cerca del suelo)
        const isFallingInHole = this.checkFallingInHole();
        if (isFallingInHole) {
            this.handleDeath();
            return;
        }

        // Verificar mensajes de la historia
        const isFinal = checkStoryMessages(this.player.x);
        if (isFinal) {
            createConfetti();
        }

        // Cámara sigue al jugador
        this.cameraX = this.player.x - this.canvas.width * 0.2;
    }

    /**
     * Dibuja todo en el canvas
     */
    draw() {
        // Fondo
        drawBackground(this.ctx, this.cameraX);

        this.ctx.save();
        this.ctx.translate(-this.cameraX, 0);

        // Plataformas
        drawPlatforms(this.ctx, this.cameraX);

        // Pinchos
        drawSpikes(this.ctx, this.cameraX);

        // Rampas
        drawRamps(this.ctx, this.cameraX);

        // Jugador (ahora con la imagen de Lucas dentro)
        this.player.draw(this.ctx);

        // Portal final épico
        drawPortal(this.ctx, this.cameraX, this.canvas.height);

        this.ctx.restore();

        // Partículas
        drawParticles(this.ctx);
    }

    /**
     * Loop principal del juego
     */
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    /**
     * Maneja el salto del jugador
     */
    handleJump() {
        if (this.gameRunning && !getIsPaused()) {
            this.player.jump();
        }
    }

    /**
     * Verifica si el jugador está cayendo en un hoyo sin plataformas
     */
    checkFallingInHole() {
        // Solo verificar si el jugador está cayendo (no saltando)
        // y está cerca del suelo (no en el aire por un salto normal)
        if (this.player.dy > 0 && this.player.y > this.canvas.height - 200) {
            const platforms = getPlatforms();
            const playerBottom = this.player.y + this.player.size;
            const playerCenterX = this.player.x + this.player.size / 2;
            
            // Verificar si hay alguna plataforma debajo en un rango razonable
            let hasPlatformBelow = false;
            for (let p of platforms) {
                if (playerCenterX > p.x && playerCenterX < p.x + p.w &&
                    playerBottom < p.y + 150 && // Rango de búsqueda más pequeño
                    p.y > playerBottom - 50) { // Permitir un poco de margen
                    hasPlatformBelow = true;
                    break;
                }
            }
            
            // Solo considerar "hoyo" si:
            // 1. Está cayendo rápido (más de 8 de velocidad)
            // 2. Está cerca del suelo (más abajo que 200px desde el fondo)
            // 3. No hay plataformas debajo
            // 4. No está en un salto normal (dy no es muy negativo recientemente)
            if (!hasPlatformBelow && 
                this.player.dy > 8 && 
                this.player.y > this.canvas.height - 200 &&
                playerBottom > this.canvas.height - 150) {
                return true;
            }
        }
        return false;
    }

    /**
     * Maneja la muerte del jugador
     */
    handleDeath() {
        // Prevenir múltiples llamadas
        if (getIsPaused()) return;
        
        // Con vidas infinitas, nunca se decrementan
        // this.lives--; // Comentado para vidas infinitas
        updateLives(this.lives);

        // Siempre mostrar mensaje de fallo y permitir continuar (vidas infinitas)
        showFailMessage();
        
        // Código de Game Over comentado (vidas infinitas)
        /*
        if (this.lives > 0) {
            showFailMessage();
        } else {
            // Game Over - Detener el juego completamente
            this.gameRunning = false;
            setIsPaused(true);
            // Usar showModal directamente para Game Over
            const modal = document.getElementById('message-modal');
            const content = document.getElementById('modal-content');
            const actions = document.getElementById('modal-actions');
            
            content.innerText = "Se acabaron las vidas.\n\nPero recuerda:\nCada caída es una lección.\n\nReinicia para intentar de nuevo.";
            actions.innerHTML = "";
            
            const btn = document.createElement('button');
            btn.className = "action-btn";
            btn.style.background = "linear-gradient(135deg, #ff0055 0%, #ff3366 100%)";
            btn.style.color = "white";
            btn.innerText = "REINICIAR JUEGO";
            btn.onclick = () => {
                location.reload();
            };
            actions.appendChild(btn);
            
            // Botón de emergencia también
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
            
            modal.style.display = 'block';
        }
    }

    /**
     * Respawn del jugador
     */
    respawn() {
        // Asegurar que el jugador respawnee en una posición segura
        this.player.respawn();
        
        // Verificar que haya una plataforma cerca
        const platforms = getPlatforms();
        let safePlatform = null;
        for (let p of platforms) {
            if (p.x <= this.player.x + 200 && p.x + p.w >= this.player.x - 100) {
                safePlatform = p;
                break;
            }
        }
        
        // Si hay plataforma segura, posicionar al jugador encima
        if (safePlatform) {
            this.player.x = safePlatform.x + 50;
            this.player.y = safePlatform.y - this.player.size - 10;
        } else {
            // Si no hay plataforma, buscar la más cercana
            let closestPlatform = platforms[0];
            let minDist = Math.abs(platforms[0].x - this.player.x);
            for (let p of platforms) {
                const dist = Math.abs(p.x - this.player.x);
                if (dist < minDist) {
                    minDist = dist;
                    closestPlatform = p;
                }
            }
            this.player.x = closestPlatform.x + 50;
            this.player.y = closestPlatform.y - this.player.size - 10;
        }
        
        this.player.dy = 0;
        this.player.grounded = false;
        setIsPaused(false);
    }
}
