/**
 * Módulo de Generación de Niveles
 * Genera plataformas, obstáculos y el nivel completo
 */

import { CONFIG, STORY_MESSAGES } from './config.js';

let platforms = [];
let spikes = [];
let stars = [];
let ramps = []; // Rampas que impulsan hacia arriba
let meteors = []; // Meteoritos

/**
 * Inicializa las estrellas de fondo (muchas más estrellas)
 */
export function initStars() {
    stars = [];
    // Muchas más estrellas para efecto espacial
    for (let i = 0; i < 300; i++) {
        stars.push({
            x: Math.random() * CONFIG.FINAL_DISTANCE * 2,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 3 + 0.5,
            brightness: Math.random(),
            twinkle: Math.random() * Math.PI * 2 // Para efecto de parpadeo
        });
    }
}

/**
 * Inicializa los meteoritos
 */
export function initMeteors() {
    meteors = [];
    // Crear meteoritos iniciales
    for (let i = 0; i < 5; i++) {
        createMeteor();
    }
}

/**
 * Crea un nuevo meteorito
 */
function createMeteor() {
    meteors.push({
        x: Math.random() * CONFIG.FINAL_DISTANCE * 2,
        y: -50 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 10, // Velocidad horizontal
        vy: 15 + Math.random() * 10, // Velocidad vertical (muy rápida)
        size: 3 + Math.random() * 4,
        length: 20 + Math.random() * 30,
        life: 1.0,
        color: `hsl(${180 + Math.random() * 40}, 100%, ${60 + Math.random() * 20}%)` // Azules/cianes
    });
}

/**
 * Genera el nivel completo
 */
export function initLevel(canvasHeight) {
    platforms = [];
    spikes = [];
    ramps = [];
    meteors = [];
    initMeteors(); // Inicializar meteoritos
    let currentX = 0;

    // Generar nivel
    let lastGapEnd = -1000; // Rastrear dónde terminó el último gap
    let firstObstacleX = 500; // Empezar a poner obstáculos desde 500px (más temprano)
    
    while (currentX < CONFIG.FINAL_DISTANCE) {
        let isSafeZone = STORY_MESSAGES.some(m => Math.abs(m.x - currentX) < 300); // Zona segura reducida
        
        // No poner gaps muy cerca de mensajes
        const nearMessage = STORY_MESSAGES.some(m => Math.abs(m.x - currentX) < 500); // Reducido de 600 a 500

        // Gap (hueco) - Muy reducido para que sea fácilmente saltable
        let gap = (!isSafeZone && !nearMessage && Math.random() > 0.75) ? 50 + Math.random() * 40 : 0; // Máximo 90px

        let width = 400 + Math.random() * 400;
        let y = canvasHeight - 100;

        if (gap > 0) {
            // Hay un gap - marcar el inicio
            lastGapEnd = currentX + gap;
            currentX += gap;
        } else {
            // Plataforma base
            platforms.push({
                x: currentX,
                y: y,
                w: width,
                h: 500,
                type: 'ground'
            });

            // ZONA SEGURA después de un gap - reducida de 200px a 150px
            const isAfterGap = (currentX - lastGapEnd) < 150;
            const safeAreaAfterGap = isAfterGap ? 150 : 0;
            
            // Añadir obstáculos (Pinchos) - MÁS FRECUENTES Y MÁS TEMPRANO
            // Cambiado de Math.random() > 0.5 (50%) a Math.random() > 0.3 (70% de probabilidad)
            // Y reducido el ancho mínimo de 300 a 200
            // Y agregado check para que aparezcan desde firstObstacleX
            if (currentX >= firstObstacleX && !isSafeZone && !isAfterGap && Math.random() > 0.3 && width > 200) {
                // Asegurar que los pinchos no estén en la zona segura
                const spikeStartX = currentX + safeAreaAfterGap + 30; // Reducido de 50 a 30
                const availableWidth = width - safeAreaAfterGap - 60; // Reducido de 100 a 60
                
                if (availableWidth > 80) { // Reducido de 100 a 80
                    let numSpikes = Math.floor(Math.random() * 2) + 1; // Máximo 2 pinchos
                    const spacing = availableWidth / (numSpikes + 1);
                    
                    for (let i = 0; i < numSpikes; i++) {
                        spikes.push({
                            x: spikeStartX + (i * spacing),
                            y: y - 25,
                            w: 25,
                            h: 25
                        });
                    }
                }
            }

            // Si acabamos de pasar un gap, poner una plataforma flotante de ayuda
            if (isAfterGap && Math.random() > 0.3) {
                platforms.push({
                    x: currentX + 100,
                    y: y - 120 - Math.random() * 30,
                    w: 140 + Math.random() * 60,
                    h: 20,
                    type: 'float'
                });
            }
            
            // Plataformas flotantes para saltar pinchos y gaps (más frecuentes)
            if (!isAfterGap && Math.random() > 0.5 && !isSafeZone) {
                platforms.push({
                    x: currentX + width * 0.3,
                    y: y - 130 - Math.random() * 50,
                    w: 130 + Math.random() * 70, // Más anchas para facilitar saltos
                    h: 20,
                    type: 'float'
                });
            }
            
            // Agregar plataformas flotantes adicionales cerca de gaps grandes
            if (!isAfterGap && width > 500 && Math.random() > 0.4 && !isSafeZone) {
                platforms.push({
                    x: currentX + width * 0.6,
                    y: y - 100 - Math.random() * 40,
                    w: 110 + Math.random() * 50,
                    h: 20,
                    type: 'float'
                });
            }
            
            // Plataforma adicional en el medio para gaps más largos
            if (!isAfterGap && width > 700 && Math.random() > 0.3 && !isSafeZone) {
                platforms.push({
                    x: currentX + width * 0.45,
                    y: y - 90 - Math.random() * 30,
                    w: 90 + Math.random() * 40,
                    h: 20,
                    type: 'float'
                });
            }

            // Agregar rampas (impulsores hacia arriba) - pero no justo después de gaps
            // Aumentado de 0.75 (25%) a 0.6 (40% de probabilidad) y reducido ancho mínimo
            if (currentX >= firstObstacleX && !isSafeZone && !isAfterGap && Math.random() > 0.6 && width > 300) {
                ramps.push({
                    x: currentX + width * 0.5,
                    y: y - 30,
                    w: 40,
                    h: 30,
                    power: -18 // Fuerza de impulso
                });
            }

            currentX += width;
        }
    }

    // Meta (Plataforma final grande)
    platforms.push({
        x: CONFIG.FINAL_DISTANCE,
        y: canvasHeight - 100,
        w: 1000,
        h: 500,
        type: 'ground',
        isGoal: true
    });
}

/**
 * Obtiene las plataformas
 */
export function getPlatforms() {
    return platforms;
}

/**
 * Obtiene los pinchos
 */
export function getSpikes() {
    return spikes;
}

/**
 * Obtiene las rampas
 */
export function getRamps() {
    return ramps;
}

/**
 * Obtiene las estrellas
 */
export function getStars() {
    return stars;
}

/**
 * Dibuja el fondo con estrellas
 */
export function drawBackground(ctx, cameraX) {
    // Fondo con gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, CONFIG.COLORS.BACKGROUND_START);
    gradient.addColorStop(1, CONFIG.COLORS.BACKGROUND_END);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Estrellas brillantes (tema espacial) - Muchas más estrellas
    stars.forEach(s => {
        let screenX = s.x - cameraX * 0.1; // Movimiento parallax lento
        if (screenX < -50) screenX += CONFIG.FINAL_DISTANCE * 2;
        if (screenX > ctx.canvas.width + 50) screenX -= CONFIG.FINAL_DISTANCE * 2;
        
        // Efecto de parpadeo
        s.twinkle += 0.1;
        const twinkleBrightness = 0.5 + Math.sin(s.twinkle) * 0.3;
        const brightness = (0.6 + s.brightness * 0.4) * twinkleBrightness;
        ctx.globalAlpha = brightness;
        
        // Colores variados para estrellas (blancas, azules, púrpuras, cianes)
        const starColors = ['#ffffff', '#00d4ff', '#6c5ce7', '#8b5cf6', '#a29bfe', '#74b9ff'];
        const starColor = starColors[Math.floor(s.brightness * starColors.length)];
        ctx.fillStyle = starColor;
        
        // Dibujar estrella con efecto de brillo
        ctx.shadowBlur = 2 + s.brightness * 3;
        ctx.shadowColor = starColor;
        ctx.fillRect(screenX, s.y, s.size, s.size);
        
        // Estrellas grandes con cruz
        if (s.size > 1.5) {
            ctx.strokeStyle = starColor;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(screenX + s.size/2, s.y);
            ctx.lineTo(screenX + s.size/2, s.y + s.size);
            ctx.moveTo(screenX, s.y + s.size/2);
            ctx.lineTo(screenX + s.size, s.y + s.size/2);
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;
    
    // Efecto de nebulosa sutil
    const nebulaGradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    nebulaGradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
    nebulaGradient.addColorStop(0.5, 'rgba(108, 92, 231, 0.05)');
    nebulaGradient.addColorStop(1, 'rgba(0, 212, 255, 0.1)');
    ctx.fillStyle = nebulaGradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Dibujar meteoritos
    drawMeteors(ctx, cameraX);
}

/**
 * Dibuja las plataformas
 */
export function drawPlatforms(ctx, cameraX) {
    platforms.forEach(p => {
        if (p.x + p.w > cameraX && p.x < cameraX + ctx.canvas.width) {
            // Sombra
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(p.x + 3, p.y + 3, p.w, p.h);

            // Plataforma
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            // Borde brillante cósmico
            const borderColor = p.isGoal ? CONFIG.COLORS.SUCCESS : (p.type === 'float' ? CONFIG.COLORS.DANGER : CONFIG.COLORS.PRIMARY);
            ctx.fillStyle = borderColor;
            ctx.shadowBlur = 20;
            ctx.shadowColor = borderColor;
            ctx.fillRect(p.x, p.y, p.w, 4);
            ctx.shadowBlur = 0;

            // Efecto especial en la meta
            if (p.isGoal) {
                ctx.fillStyle = 'rgba(46, 204, 113, 0.2)';
                ctx.fillRect(p.x, p.y, p.w, p.h);
            }
        }
    });
}

/**
 * Dibuja los pinchos
 */
export function drawSpikes(ctx, cameraX) {
    // Pinchos con color cósmico (rosa neón)
    ctx.fillStyle = CONFIG.COLORS.DANGER;
    spikes.forEach(s => {
        if (s.x > cameraX - 50 && s.x < cameraX + ctx.canvas.width + 50) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = CONFIG.COLORS.DANGER;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y + s.h);
            ctx.lineTo(s.x + s.w / 2, s.y);
            ctx.lineTo(s.x + s.w, s.y + s.h);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    });
}

/**
 * Dibuja las rampas
 */
export function drawRamps(ctx, cameraX) {
    ramps.forEach(r => {
        if (r.x > cameraX - 50 && r.x < cameraX + ctx.canvas.width + 50) {
            // Base de la rampa con color cósmico (cian)
            ctx.fillStyle = CONFIG.COLORS.SUCCESS;
            ctx.shadowBlur = 20;
            ctx.shadowColor = CONFIG.COLORS.SUCCESS;
            ctx.beginPath();
            ctx.moveTo(r.x, r.y + r.h);
            ctx.lineTo(r.x + r.w, r.y);
            ctx.lineTo(r.x + r.w, r.y + r.h);
            ctx.lineTo(r.x, r.y + r.h);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            // Flecha indicadora brillante
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = CONFIG.COLORS.SUCCESS;
            ctx.beginPath();
            ctx.moveTo(r.x + r.w/2, r.y + 10);
            ctx.lineTo(r.x + r.w/2 - 5, r.y + 20);
            ctx.lineTo(r.x + r.w/2 + 5, r.y + 20);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    });
}

/**
 * Dibuja y actualiza los meteoritos
 */
export function drawMeteors(ctx, cameraX) {
    // Actualizar y dibujar meteoritos
    meteors.forEach((m, index) => {
        // Actualizar posición
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.02;
        
        // Si el meteorito sale de pantalla o se desvanece, crear uno nuevo
        if (m.y > ctx.canvas.height + 50 || m.life <= 0) {
            meteors[index] = {
                x: Math.random() * ctx.canvas.width,
                y: -50 - Math.random() * 200,
                vx: (Math.random() - 0.5) * 8,
                vy: 15 + Math.random() * 10,
                size: 3 + Math.random() * 4,
                length: 20 + Math.random() * 30,
                life: 1.0,
                color: `hsl(${180 + Math.random() * 40}, 100%, ${60 + Math.random() * 20}%)`
            };
        } else {
            // Dibujar meteorito (estrella fugaz)
            ctx.save();
            ctx.globalAlpha = m.life;
            
            // Cuerpo del meteorito (línea brillante)
            const gradient = ctx.createLinearGradient(
                m.x - m.length * 0.3, m.y - m.length * 0.3,
                m.x, m.y
            );
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(0.5, m.color);
            gradient.addColorStop(1, '#ffffff');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = m.size;
            ctx.shadowBlur = 15;
            ctx.shadowColor = m.color;
            ctx.beginPath();
            ctx.moveTo(m.x - m.length * 0.3, m.y - m.length * 0.3);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
            
            // Cabeza brillante del meteorito
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = m.color;
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    });
    
    // Asegurar que siempre haya meteoritos
    if (meteors.length < 8) {
        createMeteor();
    }
}

/**
 * Dibuja el portal galáctico épico al final
 */
export function drawPortal(ctx, cameraX, canvasHeight) {
    let portalX = CONFIG.FINAL_DISTANCE + 200;
    let portalY = canvasHeight - 300;
    
    if (portalX > cameraX - 300 && portalX < cameraX + ctx.canvas.width + 300) {
        const time = Date.now() * 0.003;
        
        // Anillos exteriores galácticos (más anillos, más épico)
        for (let i = 0; i < 5; i++) {
            const ringRadius = 100 + i * 40 + Math.sin(time * 0.5 + i) * 15;
            const alpha = 0.4 - i * 0.08;
            const rotation = time * (0.3 + i * 0.1);
            
            ctx.save();
            ctx.translate(portalX, portalY);
            ctx.rotate(rotation);
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, ringRadius);
            const hue1 = (time * 30 + i * 50) % 360;
            const hue2 = (hue1 + 60) % 360;
            const hue3 = (hue1 + 120) % 360;
            
            gradient.addColorStop(0, `hsla(${hue1}, 100%, 70%, ${alpha})`);
            gradient.addColorStop(0.3, `hsla(${hue2}, 100%, 60%, ${alpha * 0.7})`);
            gradient.addColorStop(0.6, `hsla(${hue3}, 100%, 50%, ${alpha * 0.4})`);
            gradient.addColorStop(1, `hsla(${hue1}, 100%, 40%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 30;
            ctx.shadowColor = `hsl(${hue1}, 100%, 60%)`;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        // Portal principal galáctico con efecto de rotación
        ctx.save();
        ctx.translate(portalX, portalY);
        ctx.rotate(time * 0.5);
        
        // Gradiente galáctico (espiral de colores)
        const mainGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 90);
        mainGradient.addColorStop(0, '#6c5ce7');
        mainGradient.addColorStop(0.2, '#8b5cf6');
        mainGradient.addColorStop(0.4, '#00d4ff');
        mainGradient.addColorStop(0.6, '#a29bfe');
        mainGradient.addColorStop(0.8, '#6c5ce7');
        mainGradient.addColorStop(1, '#4c3fb0');
        
        ctx.fillStyle = mainGradient;
        ctx.shadowBlur = 50;
        ctx.shadowColor = '#6c5ce7';
        ctx.beginPath();
        ctx.arc(0, 0, 90, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Borde brillante galáctico
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00d4ff';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Anillos internos rotativos
        for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `hsl(${(time * 50 + i * 60) % 360}, 100%, 70%)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 50 + i * 10, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Centro oscuro con efecto de agujero negro
        const blackHoleGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
        blackHoleGradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
        blackHoleGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)');
        blackHoleGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = blackHoleGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.fill();
        
        // Estrella central brillante
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#00d4ff';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();

        // Partículas galácticas orbitando (muchas más)
        for (let i = 0; i < 16; i++) {
            const angle = (time * 3 + i * Math.PI / 8) % (Math.PI * 2);
            const dist = 110 + Math.sin(time * 4 + i) * 20;
            const px = portalX + Math.cos(angle) * dist;
            const py = portalY + Math.sin(angle) * dist;
            
            const particleHue = (time * 60 + i * 22.5) % 360;
            ctx.fillStyle = `hsl(${particleHue}, 100%, 70%)`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = ctx.fillStyle;
            ctx.beginPath();
            ctx.arc(px, py, 5 + Math.sin(time * 2 + i) * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Rayos de luz galácticos
        for (let i = 0; i < 8; i++) {
            const rayAngle = (time * 0.5 + i * Math.PI / 4) % (Math.PI * 2);
            const rayLength = 120 + Math.sin(time * 2 + i) * 30;
            
            const rayGradient = ctx.createLinearGradient(
                portalX, portalY,
                portalX + Math.cos(rayAngle) * rayLength,
                portalY + Math.sin(rayAngle) * rayLength
            );
            rayGradient.addColorStop(0, `hsla(${(time * 30 + i * 45) % 360}, 100%, 70%, 0.6)`);
            rayGradient.addColorStop(1, 'transparent');
            
            ctx.strokeStyle = rayGradient;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsl(${(time * 30 + i * 45) % 360}, 100%, 70%)`;
            ctx.beginPath();
            ctx.moveTo(portalX, portalY);
            ctx.lineTo(
                portalX + Math.cos(rayAngle) * rayLength,
                portalY + Math.sin(rayAngle) * rayLength
            );
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Texto "FUTURO" con efecto galáctico
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 16px 'Press Start 2P'";
        ctx.textAlign = 'center';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#6c5ce7';
        ctx.fillText("FUTURO", portalX, portalY + 120);
        
        // Texto adicional "PRINCIPIO"
        ctx.font = "bold 12px 'Press Start 2P'";
        ctx.shadowColor = '#00d4ff';
        ctx.fillText("PRINCIPIO", portalX, portalY + 145);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
    }
}
