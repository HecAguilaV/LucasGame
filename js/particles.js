/**
 * Sistema de Partículas ÉPICO
 * Maneja efectos visuales de partículas avanzados
 */

let particles = [];

/**
 * Crea partículas ÉPICAS cuando el jugador salta
 */
export function createJumpParticles(x, y, size) {
    const time = Date.now();
    // Más partículas con efectos variados
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI / 2) + (Math.random() - 0.5) * 1.5; // Hacia abajo con dispersión
        const speed = 3 + Math.random() * 5;
        const hue = (time * 0.1 + i * 20) % 360;
        
        particles.push({
            x: x + size / 2 + (Math.random() - 0.5) * size,
            y: y + size,
            vx: Math.cos(angle) * speed * (Math.random() - 0.5) * 2,
            vy: Math.sin(angle) * speed * 0.5,
            life: 30 + Math.random() * 20,
            maxLife: 50,
            color: `hsl(${hue}, 100%, 60%)`,
            size: 3 + Math.random() * 4,
            type: 'jump'
        });
    }
    
    // Anillo de energía
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        particles.push({
            x: x + size / 2,
            y: y + size / 2,
            vx: Math.cos(angle) * 6,
            vy: Math.sin(angle) * 6,
            life: 20,
            maxLife: 20,
            color: '#00d4ff',
            size: 2,
            type: 'ring'
        });
    }
}

/**
 * Crea confeti ÉPICO para la celebración final
 */
export function createConfetti() {
    particles = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Explosión de confeti colorido
    for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 20;
        const hue = Math.random() * 360;
        
        particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 10,
            life: 100 + Math.random() * 100,
            maxLife: 200,
            color: `hsl(${hue}, 100%, 60%)`,
            size: 4 + Math.random() * 8,
            type: 'confetti',
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.3
        });
    }
    
    // Estrellas brillantes
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 150 + Math.random() * 100,
            maxLife: 250,
            color: '#ffffff',
            size: 3 + Math.random() * 5,
            type: 'star'
        });
    }
}

/**
 * Crea partículas de impacto cuando el jugador choca
 */
export function createImpactParticles(x, y, size) {
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 8;
        
        particles.push({
            x: x + size / 2,
            y: y + size / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 25 + Math.random() * 15,
            maxLife: 40,
            color: `hsl(${Math.random() * 60}, 100%, 50%)`, // Rojos/naranjas
            size: 2 + Math.random() * 4,
            type: 'impact'
        });
    }
}

/**
 * Actualiza todas las partículas
 */
export function updateParticles() {
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Gravedad variable según tipo
        if (p.type === 'confetti') {
            p.vy += 0.2;
            p.vx *= 0.99; // Fricción del aire
            if (p.rotation !== undefined) {
                p.rotation += p.rotationSpeed;
            }
        } else if (p.type === 'star') {
            // Las estrellas flotan
            p.vy += Math.sin(Date.now() * 0.01 + p.x) * 0.05;
        } else {
            p.vy += 0.15;
        }
        
        p.life--;
    });
    particles = particles.filter(p => p.life > 0);
}

/**
 * Dibuja todas las partículas con efectos ÉPICOS
 */
export function drawParticles(ctx) {
    const time = Date.now() * 0.001;
    
    particles.forEach(p => {
        const lifeRatio = p.life / (p.maxLife || 20);
        
        ctx.save();
        ctx.globalAlpha = lifeRatio;
        
        if (p.type === 'confetti') {
            // Confeti con rotación y brillo
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation || 0);
            
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
            
        } else if (p.type === 'star') {
            // Estrellas con brillo pulsante
            const pulse = 1 + Math.sin(time * 5 + p.x) * 0.3;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 20 * pulse;
            ctx.shadowColor = '#ffffff';
            
            // Dibujar estrella de 4 puntas
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 - Math.PI / 4;
                const len = p.size * pulse;
                if (i === 0) {
                    ctx.moveTo(p.x + Math.cos(angle) * len, p.y + Math.sin(angle) * len);
                } else {
                    ctx.lineTo(p.x + Math.cos(angle) * len, p.y + Math.sin(angle) * len);
                }
                // Punto intermedio más corto
                const midAngle = angle + Math.PI / 8;
                ctx.lineTo(p.x + Math.cos(midAngle) * len * 0.3, p.y + Math.sin(midAngle) * len * 0.3);
            }
            ctx.closePath();
            ctx.fill();
            
        } else if (p.type === 'ring') {
            // Anillo de energía
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (1 - lifeRatio) * 3, 0, Math.PI * 2);
            ctx.stroke();
            
        } else {
            // Partículas normales con gradiente
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    });
    ctx.globalAlpha = 1;
}
