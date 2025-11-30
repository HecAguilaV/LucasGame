/**
 * Sistema de Partículas
 * Maneja efectos visuales de partículas
 */

let particles = [];

/**
 * Crea partículas cuando el jugador salta
 */
export function createJumpParticles(x, y, size) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x + size / 2,
            y: y + size,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3,
            life: 20,
            color: '#6c5ce7'
        });
    }
}

/**
 * Crea confeti para la celebración final
 */
export function createConfetti() {
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15 - 5,
            life: 60 + Math.random() * 40,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
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
        p.vy += 0.15;
        p.life--;
    });
    particles = particles.filter(p => p.life > 0);
}

/**
 * Dibuja todas las partículas
 */
export function drawParticles(ctx) {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 20;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}
