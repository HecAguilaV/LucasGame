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
     * Dibuja el jugador en el canvas con la imagen de Lucas - VERSION ÉPICA
     */
    draw(ctx) {
        const time = Date.now() * 0.001;
        
        // TRAIL ÉPICO con efecto de fuego/energía cósmica
        this.trail.forEach((t, i) => {
            const progress = i / this.trail.length;
            const size = this.size * (0.3 + progress * 0.7);
            
            // Colores de fuego cósmico que cambian
            const hue1 = (time * 100 + progress * 120) % 360;
            const hue2 = (hue1 + 60) % 360;
            
            // Efecto de llama
            ctx.save();
            ctx.globalAlpha = t.alpha * progress * 0.8;
            
            // Gradiente de fuego
            const flameGradient = ctx.createRadialGradient(
                t.x + size/2, t.y + size/2, 0,
                t.x + size/2, t.y + size/2, size
            );
            flameGradient.addColorStop(0, `hsl(${hue1}, 100%, 80%)`);
            flameGradient.addColorStop(0.5, `hsl(${hue2}, 100%, 60%)`);
            flameGradient.addColorStop(1, `hsla(${hue1}, 100%, 40%, 0)`);
            
            ctx.fillStyle = flameGradient;
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsl(${hue1}, 100%, 70%)`;
            
            // Forma ondulante para el trail
            ctx.beginPath();
            const wobble = Math.sin(time * 10 + i) * 3;
            ctx.arc(t.x + size/2 + wobble, t.y + size/2, size/2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });

        // AURA EXTERIOR BRILLANTE
        ctx.save();
        const auraSize = this.size + 15 + Math.sin(time * 5) * 5;
        const auraGradient = ctx.createRadialGradient(
            this.x + this.size/2, this.y + this.size/2, this.size/2,
            this.x + this.size/2, this.y + this.size/2, auraSize
        );
        const auraHue = (time * 50) % 360;
        auraGradient.addColorStop(0, `hsla(${auraHue}, 100%, 60%, 0.3)`);
        auraGradient.addColorStop(0.5, `hsla(${auraHue + 60}, 100%, 50%, 0.15)`);
        auraGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(this.x + this.size/2, this.y + this.size/2, auraSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Si las imágenes están cargadas, dibujar la imagen de Lucas
        if (this.imagesLoaded) {
            const currentImage = this.getCurrentImage();
            
            // BORDE EXTERIOR ÉPICO con pulso
            const pulseSize = 4 + Math.sin(time * 8) * 2;
            ctx.shadowBlur = 30 + Math.sin(time * 6) * 10;
            ctx.shadowColor = '#ff0055';
            ctx.strokeStyle = '#ff0055';
            ctx.lineWidth = pulseSize;
            ctx.strokeRect(this.x - 4, this.y - 4, this.size + 8, this.size + 8);
            
            // BORDE INTERMEDIO neón
            ctx.shadowColor = '#00d4ff';
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 1, this.y - 1, this.size + 2, this.size + 2);
            ctx.shadowBlur = 0;

            // Dibujar la imagen de Lucas con clip redondeado
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(this.x, this.y, this.size, this.size, 4);
            ctx.clip();
            ctx.drawImage(currentImage, this.x, this.y, this.size, this.size);
            ctx.restore();

            // EFECTO DE BRILLO SUPERIOR épico
            const shineGradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.size);
            shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            shineGradient.addColorStop(0.3, 'rgba(108, 92, 231, 0.2)');
            shineGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
            ctx.fillStyle = shineGradient;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            
            // PARTÍCULAS DE ENERGÍA alrededor del jugador
            for (let i = 0; i < 6; i++) {
                const angle = time * 3 + i * Math.PI / 3;
                const dist = this.size * 0.8 + Math.sin(time * 5 + i) * 5;
                const px = this.x + this.size/2 + Math.cos(angle) * dist;
                const py = this.y + this.size/2 + Math.sin(angle) * dist;
                
                ctx.fillStyle = `hsl(${(time * 100 + i * 60) % 360}, 100%, 70%)`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(px, py, 3 + Math.sin(time * 8 + i) * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
            
        } else {
            // Fallback: cubo ÉPICO mientras cargan las imágenes
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.size, this.y + this.size);
            gradient.addColorStop(0, '#00d2ff');
            gradient.addColorStop(0.3, '#ff0055');
            gradient.addColorStop(0.6, '#ff00ff');
            gradient.addColorStop(1, '#6c5ce7');
            
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 35;
            ctx.shadowColor = '#ff0055';
            ctx.fillRect(this.x, this.y, this.size, this.size);
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
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
