/**
 * Configuración del juego
 * Aquí puedes modificar los valores principales del juego
 */

// ==========================================
// CONFIGURACIÓN PRIVADA (Número de teléfono)
// ==========================================
// El número de teléfono se carga de forma segura:
// 1. Primero intenta desde variable de entorno (Vercel) - VERCEL_PHONE_NUMBER
// 2. Si no existe, intenta desde config.private.js (desarrollo local)
// 3. Si no existe, será undefined

// Obtener número de teléfono
// Se carga dinámicamente desde:
// 1. API endpoint /api/config (en Vercel/producción) - lee variable de entorno VERCEL_PHONE_NUMBER
// 2. config.private.js (en desarrollo local)
let phoneNumber = undefined;

export const CONFIG = {
    // Número de teléfono para WhatsApp
    // Se actualiza dinámicamente en ui.js desde API o archivo privado
    PHONE_NUMBER: phoneNumber,
    
    // Configuración del juego
    GAME_SPEED: 4,
    GRAVITY: 0.6,
    FINAL_DISTANCE: 12000, // Juego más largo
    LIVES: 3, // Número de vidas
    
    // Configuración del jugador
    PLAYER: {
        SIZE: 25,
        JUMP_POWER: -16, // Aumentado aún más para saltar más lejos
        MAX_TRAIL_LENGTH: 15
    },
    
    // Configuración visual - TEMA ESPACIAL/CÓSMICO
    COLORS: {
        PRIMARY: '#6c5ce7',      // Púrpura espacial
        DANGER: '#ff6b9d',      // Rosa neón suave
        SUCCESS: '#00d4ff',     // Cian brillante
        BACKGROUND_START: '#0d0d2e',  // Azul oscuro profundo
        BACKGROUND_END: '#1a0d3d',    // Púrpura oscuro
        STAR_COLOR: '#ffffff',   // Estrellas blancas
        NEBULA_COLOR: '#8b5cf6' // Nebulosa púrpura
    }
};

/**
 * Mensajes del Padre (Historia)
 * Estos mensajes aparecen durante el juego
 */
export const STORY_MESSAGES = [
    {
        x: 200,
        shown: false,
        text: "Lucas, hijo...\n\nBienvenido a tu mayoría de edad.\nAquí comienza el verdadero juego.\n\nEstoy orgulloso de ti."
    },
    {
        x: 1200,
        shown: false,
        text: "El 29 de noviembre de 2007\ncambió mi vida para siempre.\n\nSé que como padre he tenido fallos\ny no siempre supe expresarme bien..."
    },
    {
        x: 2400,
        shown: false,
        text: "...y a veces soy duro con mis 'NO'.\n\nPero cada decisión, buena o mala,\nconstruye tu camino.\n\nSolo quiero lo mejor para ti."
    },
    {
        x: 3600,
        shown: false,
        text: "Habrá obstáculos puntiagudos\n(vicios, malas compañías).\n\nParecen divertidos,\npero te quitan vida.\n\nSaltarlos depende de ti."
    },
    {
        x: 4800,
        shown: false,
        text: "No tengo todo el dinero del mundo.\n\nMe duele cuando siento que\nsolo me hablas por eso...\n\nYo quiero darte algo que no se compra:\nmi apoyo incondicional."
    },
    {
        x: 10000,
        shown: false,
        isFinal: true,
        text: "Esta meta no es el final.\nEs tu PUNTO DE PARTIDA.\n\nEstoy orgulloso de ti, Lucas.\n\nAunque a veces no lo sepa expresar,\naquí estoy para ti.\n\nEscríbeme, hijo. Te amo."
    }
];

/**
 * Mensajes cuando el jugador falla
 */
export const FAIL_MESSAGES = [
    "Caerse está permitido.\nLevantarse es obligatorio.\n\nInténtalo de nuevo.",
    "Una mala decisión no define tu futuro.\nSigue adelante, hijo.",
    "Los errores son experiencia.\nNo te rindas ahora.",
    "Aquí estoy para apoyarte cuando caigas.\nSiempre.",
    "No te rindas.\nTú puedes con esto."
];
