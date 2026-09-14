const hero = document.getElementById('hero-interactive');

const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff3300', '#00ff66', '#ffffff'];
const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>+*=';

let frameCount = 0;

document.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const isInHero = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top && e.clientY <= rect.bottom;

    // If cursor is outside hero, zap all lingering pixels immediately
    if (!isInHero) {
        document.querySelectorAll('.trail-pixel').forEach(p => p.remove());
        return;
    }

    frameCount++;
    // Skip every 2nd frame to keep it readable
    if (frameCount % 2 !== 0) return;

    // Coordinates relative to the hero (not the viewport)
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    spawnGlitch(relX, relY);
});

function spawnGlitch(x, y) {
    const el = document.createElement('div');
    el.className = 'trail-pixel';

    const color = colors[Math.floor(Math.random() * colors.length)];
    const isChar = Math.random() > 0.45; // ~55% characters, 45% squares

    if (isChar) {
        // --- Glitch character ---
        const char = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        const size = Math.floor(Math.random() * 16) + 18; // 18–34px
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
            text-shadow: 0 0 4px ${color};
        `;
    } else {
        // --- Bigger pixel square (8–24px) ---
        const size = Math.floor(Math.random() * 16) + 8;
        el.style.cssText = `
            position: absolute;
            left: ${x - size / 2}px;
            top: ${y - size / 2}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            box-shadow: 0 0 4px ${color};
            pointer-events: none;
            z-index: 10;
            opacity: 1;
        `;
    }

    hero.appendChild(el);

    // Fade out over ~400ms
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

    // Safety removal
    setTimeout(() => { if (el.parentNode) el.remove(); }, 500);
}

// Title glitch hover
const title = document.querySelector('.display-title');
title.addEventListener('mouseenter', () => {
    title.style.color = '#00ffff';
});
title.addEventListener('mouseleave', () => {
    title.style.color = '#ffffff';
});
