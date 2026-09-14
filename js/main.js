const header = document.querySelector('.site-header');
const hero = document.getElementById('hero-interactive');

// Create a full-page container for effects
const effectLayer = document.createElement('div');
effectLayer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
    z-index: 0;
`;
document.body.appendChild(effectLayer);

// Cap active elements to prevent memory buildup
const MAX_ELEMENTS = 50;

const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff3300', '#00ff66', '#ffffff'];
const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>+*=';

// Throttle: only spawn effects every 60ms instead of every frame
let lastSpawn = 0;
const THROTTLE_MS = 60;

document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastSpawn < THROTTLE_MS) return;
    lastSpawn = now;

    const headerRect = header.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    const topLimit = headerRect.top + window.scrollY;
    const bottomLimit = heroRect.bottom + window.scrollY;
    const mousePageY = e.clientY + window.scrollY;

    const isInZone = mousePageY >= topLimit && mousePageY <= bottomLimit &&
                     e.clientX >= 0 && e.clientX <= window.innerWidth;

    if (!isInZone) return;

    // Clean up excess elements before spawning — keeps DOM lightweight
    while (effectLayer.children.length > MAX_ELEMENTS) {
        effectLayer.firstChild.remove();
    }

    spawnGlowOrb(e.pageX, mousePageY);
    spawnGlitch(e.pageX, mousePageY);
});

function spawnGlowOrb(x, y) {
    // Varying sizes: 100px to 800px
    const size = 100 + Math.random() * 700;
    const half = size / 2;

    const orb = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];

    orb.style.cssText = `
        position: absolute;
        left: ${x - half}px;
        top: ${y - half}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, ${color}, transparent 70%);
        opacity: 0.4;
        pointer-events: none;
        filter: blur(${15 + Math.random() * 20}px);
        will-change: opacity, filter;
    `;
    effectLayer.appendChild(orb);

    // Use CSS transition instead of manual rAF loop — GPU-composited, way less lag
    requestAnimationFrame(() => {
        orb.style.transition = 'opacity 1.5s ease-out, filter 1.5s ease-out';
        orb.style.opacity = '0';
        orb.style.filter = `blur(120px)`;
    });

    setTimeout(() => orb.remove(), 1600);
}

function spawnGlitch(x, y) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isChar = Math.random() > 0.4;

    const size = Math.floor(Math.random() * 20) + 20;

    el.style.cssText = `
        position: absolute;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        color: ${color};
        font-size: ${size}px;
        font-family: monospace;
        font-weight: bold;
        pointer-events: none;
        text-shadow: 0 0 10px ${color};
        opacity: 1;
        will-change: opacity;
    `;

    if (isChar) {
        el.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    } else {
        el.style.background = color;
    }

    effectLayer.appendChild(el);

    // CSS transition for the fade — no per-frame JS overhead
    requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.4s ease-out';
        el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 450);
}
