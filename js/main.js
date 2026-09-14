const hero = document.getElementById('hero-interactive');

const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff3300', '#00ff66', '#ffffff'];
const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>+*=';

let frameCount = 0;
let currentColor = colors;

// ---------- Blurred glow orb ----------
const glowOrb = document.createElement('div');
glowOrb.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0;
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.3s ease;
`;
hero.appendChild(glowOrb);
hero.style.overflow = 'hidden'; // already set but ensure it's there

// ---------- Mouse move ----------
document.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const isInHero = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top && e.clientY <= rect.bottom;

    if (!isInHero) {
        // Fade glow orb out when leaving hero
        glowOrb.style.opacity = '0';
        // Remove remaining trail pixels
        document.querySelectorAll('.trail-pixel').forEach(p => p.remove());
        return;
    }

    // Position + show glow orb
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    glowOrb.style.left = (relX - 200) + 'px';
    glowOrb.style.top  = (relY - 200) + 'px';
    glowOrb.style.background = `radial-gradient(circle, ${currentColor}, transparent 70%)`;
    glowOrb.style.opacity = '0.4';

    frameCount++;
    if (frameCount % 2 !== 0) return;

    spawnGlitch(relX, relY);
});

// ---------- Spawn a single trail element ----------
function spawnGlitch(x, y) {
    const el = document.createElement('div');
    el.className = 'trail-pixel';

    const color = colors[Math.floor(Math.random() * colors.length)];
    currentColor = color; // glow orb will adopt this on next mousemove

    const isChar = Math.random() > 0.45;

    if (isChar) {
        const char = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        const size = Math.floor(Math.random() * 16) + 18;
        el.textContent = char;
        el.style.cssText = `
            position: absolute;
            left: ${x - size / 2}px;
            top: ${y - size / 2}px;
            font-size: ${size}px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            color: ${color};
            pointer-events: none;
            z-index: 10;
            opacity: 1;
            text-shadow: 0 0 8px ${color}, 0 0 20px ${color};
        `;
    } else {
        const size = Math.floor(Math.random() * 16) + 8;
        el.style.cssText = `
            position: absolute;
            left: ${x - size / 2}px;
            top: ${y - size / 2}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            box-shadow: 0 0 8px ${color}, 0 0 20px ${color};
            pointer-events: none;
            z-index: 10;
            opacity: 1;
        `;
    }

    hero.appendChild(el);

    // Fade out
    let opacity = 1;
    const fade = () => {
        opacity -= 0.045;
        if (opacity <= 0) {
            el.remove();
            return;
        }
        el.style.opacity = opacity;
        requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);

    setTimeout(() => { if (el.parentNode) el.remove(); }, 500);
}

// ---------- Title glitch hover ----------
const title = document.querySelector('.display-title');
title.addEventListener('mouseenter', () => {
    title.style.color = '#00ffff';
});
title.addEventListener('mouseleave', () => {
    title.style.color = '#ffffff';
});
