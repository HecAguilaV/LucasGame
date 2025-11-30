# Lucas: Level 18 🎮

Un juego interactivo especial creado con amor para celebrar la mayoría de edad de Lucas.

## 📁 Estructura del Proyecto

```
LucasGame/
├── index.html          # Punto de entrada HTML
├── css/
│   └── style.css       # Estilos del juego (tema espacial)
├── js/
│   ├── main.js         # Inicialización principal
│   ├── config.js       # Configuración y mensajes
│   ├── game.js         # Lógica principal del juego
│   ├── player.js       # Módulo del jugador (BabyLucas/YoungLucas)
│   ├── level.js        # Generación de niveles, estrellas, meteoritos, portal
│   ├── particles.js    # Sistema de partículas
│   └── ui.js           # Interfaz y modales
├── static/
│   ├── BabyLucas.jpg   # Imagen del personaje (inicio)
│   └── YoungLucas.jpg  # Imagen del personaje (final)
├── server.js           # Servidor local para desarrollo
├── package.json        # Dependencias Node.js
├── start-server.ps1    # Script PowerShell para iniciar servidor
├── start-server.bat    # Script CMD para iniciar servidor
├── vercel.json         # Configuración de Vercel
└── README.md           # Este archivo
```

## 🎯 Características

- ✅ **Código modular y organizado** - Fácil de mantener y extender
- ✅ **Tema espacial/cósmico** - Ambiente galáctico con estrellas, meteoritos y efectos neon
- ✅ **Juego estilo Geometry Dash** - Plataformas, pinchos, rampas y desafíos
- ✅ **Sistema de vidas** - 3 vidas para completar el juego
- ✅ **Personaje dinámico** - BabyLucas al inicio, YoungLucas al final
- ✅ **Portal galáctico épico** - Meta final con efectos visuales impresionantes
- ✅ **300 estrellas** - Fondo espacial con estrellas parpadeantes
- ✅ **Meteoritos rápidos** - Estrellas fugaces cruzando el espacio
- ✅ **Rampas impulsoras** - Elementos que ayudan al jugador a saltar más alto
- ✅ **Mensajes emocionales** - 6 mensajes especiales durante el gameplay
- ✅ **Diseño responsive** - Optimizado para móviles y desktop
- ✅ **Efectos visuales avanzados** - Partículas, brillos neon, efectos cósmicos
- ✅ **Sistema de progreso** - Barra de progreso y contador de distancia

## 🧪 Probar en Local

### Opción 1: Con Node.js (Recomendado)

1. **Instala Node.js** (si no lo tienes):
   - Descarga desde: https://nodejs.org/
   - O verifica si ya lo tienes: `node --version`

2. **Inicia el servidor:**
   ```bash
   # Windows (PowerShell)
   .\start-server.ps1
   
   # O Windows (CMD)
   start-server.bat
   
   # O manualmente
   node server.js
   ```

3. **Abre tu navegador:**
   - Ve a: `http://localhost:3000`
   - ¡Listo! El juego debería funcionar

### Opción 2: Con Python (Alternativa)

Si tienes Python instalado:

```bash
# Python 3
python -m http.server 3000

# O Python 2
python -m SimpleHTTPServer 3000
```

Luego abre: `http://localhost:3000`

### Opción 3: Con VS Code Live Server

Si usas VS Code:
1. Instala la extensión "Live Server"
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🚀 Cómo desplegar en Vercel

1. **Configura tu número de teléfono:**
   - Abre `js/config.js`
   - Busca la línea: `PHONE_NUMBER: "569XXXXXXXX",`
   - Reemplaza con tu número (formato: código país + número, sin + ni espacios)
   - Ejemplo: `PHONE_NUMBER: "56912345678",` para Chile

2. **Sube a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión o crea una cuenta
   - Haz clic en "Add New Project"
   - Conecta tu repositorio o arrastra la carpeta del proyecto
   - Vercel detectará automáticamente la configuración
   - Haz clic en "Deploy"

3. **¡Listo!**
   - Vercel te dará una URL única
   - Comparte el link con Lucas por correo electrónico

## 📱 Uso

- **Desktop:** Usa la barra espaciadora, flecha arriba o haz clic para saltar
- **Móvil:** Toca la pantalla para saltar
- **Objetivo:** Llega al portal galáctico final (12,000px de distancia) mientras lees los mensajes especiales
- **Vidas:** Tienes 3 vidas. Si pierdes todas, puedes reiniciar el juego
- **Rampas:** Las rampas azules/cian te impulsan hacia arriba - úsalas para saltos más altos
- **Pinchos:** Evita los pinchos rojos - te quitan una vida
- **Huecos:** Ten cuidado con los huecos entre plataformas

## 💝 Mensajes

El juego incluye 6 mensajes especiales que aparecen durante el juego, expresando amor, apoyo y orgullo. Puedes personalizarlos en `js/config.js`. Los mensajes aparecen en puntos específicos del recorrido y el último mensaje aparece cerca del portal final.

## 🛠️ Tecnologías

- HTML5 Canvas
- CSS3 con animaciones
- JavaScript ES6+ (módulos)
- Fuente retro: Press Start 2P

## 🔧 Personalización

### Cambiar mensajes
Edita el array `STORY_MESSAGES` en `js/config.js`

### Ajustar dificultad
Modifica los valores en `CONFIG` dentro de `js/config.js`:
- `GAME_SPEED`: Velocidad del juego
- `GRAVITY`: Fuerza de gravedad
- `PLAYER.JUMP_POWER`: Potencia del salto

### Cambiar colores y tema
Modifica el objeto `COLORS` en `CONFIG` dentro de `js/config.js`. El juego actualmente usa un tema espacial/cósmico con:
- **Púrpura espacial** (`#6c5ce7`) - Color principal
- **Cian brillante** (`#00d4ff`) - Acentos y efectos
- **Rosa neón** (`#ff6b9d`) - Pinchos y elementos de peligro
- **Fondo azul oscuro** - Ambiente espacial profundo

### Cambiar imágenes del personaje
Reemplaza los archivos en `static/`:
- `BabyLucas.jpg` - Se muestra en la primera mitad del juego
- `YoungLucas.jpg` - Se muestra en la segunda mitad del juego

### Ajustar elementos del nivel
En `js/level.js` puedes modificar:
- Cantidad de estrellas (actualmente 300)
- Cantidad de meteoritos (actualmente 8)
- Frecuencia de plataformas flotantes
- Tamaño de los huecos entre plataformas
- Distancia final del juego (actualmente 12,000px)

## 📝 Notas

- El juego es completamente offline después de cargar
- No requiere base de datos ni backend
- Compatible con todos los navegadores modernos
- Usa módulos ES6, asegúrate de servir desde un servidor (Vercel lo hace automáticamente)

## 🎨 Arquitectura

El código está organizado en módulos separados:

- **config.js**: Configuración centralizada (velocidad, gravedad, colores, mensajes)
- **player.js**: Lógica del jugador (física, colisiones, animación, cambio de imagen)
- **level.js**: Generación de niveles, estrellas, meteoritos, portal galáctico y renderizado
- **particles.js**: Sistema de efectos visuales (partículas de salto, confetti)
- **ui.js**: Interfaz de usuario, modales, vidas, progreso y mensajes
- **game.js**: Coordinador principal del juego (loop, colisiones, respawn)
- **main.js**: Punto de entrada e inicialización de eventos

## 🌟 Características Visuales

### Ambiente Espacial
- **300 estrellas** con efecto de parpadeo y movimiento parallax
- **Meteoritos rápidos** (estrellas fugaces) cruzando el espacio constantemente
- **Efecto de nebulosa** sutil en el fondo
- **Gradientes cósmicos** en plataformas y elementos

### Portal Galáctico Final
- **5 anillos exteriores** rotativos con colores cambiantes
- **Portal principal** con gradiente espiral de colores
- **Efecto de agujero negro** en el centro
- **16 partículas** orbitando alrededor
- **8 rayos de luz** galácticos
- **Textos "FUTURO" y "PRINCIPIO"** indicando el final/inicio

### Efectos Neon
- Bordes brillantes en plataformas y personaje
- Sombras y brillos en todos los elementos
- Partículas con efectos de luz
- Trail del jugador con colores cósmicos

---

Hecho con ❤️ para Lucas en su 18º cumpleaños
> © 2025 - Un Soñador con Poca RAM 👨🏻‍💻