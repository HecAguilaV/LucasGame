/**
 * Módulo del Jugador
 * Maneja toda la lógica relacionada con el jugador
 */

import { CONFIG } from './config.js';
import { createJumpParticles } from './particles.js';

export class Player {
    constructor() {
        this.x = 100;
        this.y = 0;
        this.size = CONFIG.PLAYER.SIZE;
        this.dy = 0;
        this.jumpPower = CONFIG.PLAYER.JUMP_POWER;
        this.grounded = false;
        this.color = '#fff';
        this.trail = [];
        this.maxTrailLength = CONFIG.PLAYER.MAX_TRAIL_LENGTH;
        this.animationFrame = 0; // Para animación de caminar
        this.lastGroundedX = 0; // Para detectar movimiento
        this.babyLucasImg = null;
        this.youngLucasImg = null;
        this.imagesLoaded = false;
        this.loadImages();
    }

    /**
     * Carga las imágenes de Lucas
     */
    loadImages() {
        this.babyLucasImg = new Image();
        this.youngLucasImg = new Image();
        
        this.babyLucasImg.onload = () => {
            if (this.youngLucasImg.complete) {
                this.imagesLoaded = true;
            }
        };
        
        this.youngLucasImg.onload = () => {
            if (this.babyLucasImg.complete) {
                this.imagesLoaded = true;
            }
        };
        
        this.babyLucasImg.src = '/static/BabyLucas.jpg';
        this.youngLucasImg.src = '/static/YoungLucas.jpg';
    }

    /**
     * Obtiene la imagen actual según la posición del jugador
     */
    getCurrentImage() {
        // Cambiar de BabyLucas a YoungLucas cuando llegue a la mitad del juego
        const transitionPoint = 6000; // Mitad aproximada del juego
        if (this.x < transitionPoint) {
            return this.babyLucasImg;
        } else {
            return this.youngLucasImg;
        }
    }

    /**
     * Hace que el jugador salte
     */
    jump() {
        if (this.grounded) {
            this.dy = this.jumpPower;
            this.grounded = false;
            createJumpParticles(this.x, this.y, this.size);
            return true; // Indica que saltó exitosamente
        }
        return false; // No pudo saltar
    }

    /**
     * Actualiza la posición y física del jugador
     */
    update(gravity, gameSpeed) {
        this.dy += gravity;
        this.y += this.dy;
        this.x += gameSpeed;

        // Animación de caminar
        if (this.grounded) {
            this.animationFrame += gameSpeed * 0.1;
            this.lastGroundedX = this.x;
        }

        // Trail visual
        if (gameSpeed > 0 && this.x % 3 < 1) {
            this.trail.push({
                x: this.x,
                y: this.y,
                alpha: 0.8
            });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }

        // Actualizar trail alpha
        this.trail.forEach(t => t.alpha -= 0.05);
        this.trail = this.trail.filter(t => t.alpha > 0);
    }

    /**
     * Resetea la posición del jugador con más espacio
     */
    respawn() {
        this.dy = 0;
        // Retroceder más para dar tiempo de reaccionar
        this.x = Math.max(100, this.x - 500);
        this.trail = [];
        // La posición Y se establecerá desde el juego para asegurar que esté en una plataforma
    }

    /**
     * Inicializa el jugador en una posición específica
     */
    init(canvasHeight) {
        this.x = 100;
        this.y = canvasHeight - 200;
        this.dy = 0;
        this.trail = [];
    }

    /**
     * Dibuja el jugador en el canvas con la imagen de Lucas
     */
    draw(ctx) {
        // Trail del jugador con colores neón
        this.trail.forEach((t, i) => {
            const progress = i / this.trail.length;
            const hue = (Date.now() * 0.1 + progress * 60) % 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${t.alpha * progress})`;
            ctx.fillRect(t.x, t.y, this.size, this.size);
        });

        // Si las imágenes están cargadas, dibujar la imagen de Lucas
        if (this.imagesLoaded) {
            const currentImage = this.getCurrentImage();
            
            // Borde brillante cósmico
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#6c5ce7';
            ctx.strokeStyle = '#6c5ce7';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 2, this.y - 2, this.size + 4, this.size + 4);
            
            // Segundo borde interior
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y, this.size, this.size);
            ctx.shadowBlur = 0;

            // Dibujar la imagen de Lucas
            ctx.save();
            // Efecto de brillo sutil
            ctx.globalAlpha = 0.95;
            ctx.drawImage(currentImage, this.x, this.y, this.size, this.size);
            ctx.globalAlpha = 1;
            ctx.restore();

            // Efecto de brillo superior
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.size / 2);
            gradient.addColorStop(0, 'rgba(108, 92, 231, 0.4)');
            gradient.addColorStop(1, 'rgba(108, 92, 231, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y, this.size, this.size / 2);
        } else {
            // Fallback: dibujar cubo con gradiente mientras cargan las imágenes
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.size);
            gradient.addColorStop(0, '#00d2ff');
            gradient.addColorStop(0.5, '#ff0055');
            gradient.addColorStop(1, '#ff00ff');
            
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#00d2ff';
            ctx.fillRect(this.x, this.y, this.size, this.size);
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.size, this.size);
            ctx.shadowBlur = 0;
        }
    }

    /**
     * Verifica colisiones con plataformas
     */
    checkPlatformCollisions(platforms) {
        this.grounded = false;
        platforms.forEach(p => {
            if (this.x + this.size > p.x &&
                this.x < p.x + p.w &&
                this.y + this.size > p.y &&
                this.y + this.size < p.y + p.h + 30 &&
                this.dy >= 0) {
                this.grounded = true;
                this.dy = 0;
                this.y = p.y - this.size;
            }
        });
    }

    /**
     * Verifica colisiones con obstáculos (pinchos)
     */
    checkSpikeCollisions(spikes) {
        for (let s of spikes) {
            if (this.x + this.size - 5 > s.x &&
                this.x + 5 < s.x + s.w &&
                this.y + this.size - 5 > s.y &&
                this.y + 5 < s.y + s.h) {
                return true; // Colisión detectada
            }
        }
        return false;
    }

    /**
     * Verifica si el jugador cayó al vacío
     */
    checkFall(canvasHeight) {
        return this.y > canvasHeight + 100;
    }
}
