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

const MAX_ELEMENTS = 40;

const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff3300', '#00ff66', '#ffffff'];
// Code & file tree inspired snippet tokens for the glitch trail
const codeSnippets = [
    '<div>', '</div>', 'class="hero"', 'const', 'import', 
    'style.css', 'main.js', 'index.html', 'function()', 
    '->', '===', '{ }', 'padding: 4vw;', 'portfolio'
];

let lastSpawn = 0;
const THROTTLE_MS = 50;

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

    while (effectLayer.children.length > MAX_ELEMENTS) {
        effectLayer.firstChild.remove();
    }

    spawnGlowOrb(e.pageX, mousePageY);
    spawnGlitchSnippet(e.pageX, mousePageY);
});

function spawnGlowOrb(x, y) {
    const size = 200 + Math.random() * 600; // Larger varied background glow
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
        opacity: 0.35;
        pointer-events: none;
        filter: blur(${30 + Math.random() * 30}px);
        will-change: opacity, filter;
    `;
    effectLayer.appendChild(orb);

    requestAnimationFrame(() => {
        orb.style.transition = 'opacity 1.8s cubic-bezier(0.1, 1, 0.1, 1), filter 1.8s cubic-bezier(0.1, 1, 0.1, 1)';
        orb.style.opacity = '0';
        orb.style.filter = `blur(140px)`;
    });

    setTimeout(() => orb.remove(), 1900);
}

function spawnGlitchSnippet(x, y) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Pick a code snippet or block token instead of just random single chars
    const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    const isBlock = Math.random() > 0.6;
    
    // Biger sizes for the trail items
    const fontSize = Math.floor(Math.random() * 12) + 14; 

    el.style.cssText = `
        position: absolute;
        left: ${x + (Math.random() * 40 - 20)}px;
        top: ${y + (Math.random() * 40 - 20)}px;
        color: ${color};
        font-size: ${fontSize}px;
        font-family: monospace;
        white-space: nowrap;
        pointer-events: none;
        text-shadow: 0 0 12px ${color}, 0 0 25px ${color};
        opacity: 1;
        will-change: opacity, transform;
    `;

    if (isBlock) {
        el.style.background = 'rgba(255, 255, 255, 0.05)';
        el.style.border = `1px solid ${color}`;
        el.style.padding = '2px 6px';
        el.style.borderRadius = '3px';
    }

    el.textContent = snippet;
    effectLayer.appendChild(el);

    requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.opacity = '0';
        el.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${(Math.random() - 0.5) * 60}px)`;
    });

    setTimeout(() => el.remove(), 700);
}
