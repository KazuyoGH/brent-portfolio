const hero = document.getElementById('hero-interactive');

// Ensure hero is positioned so absolute children align to it correctly
hero.style.position = 'relative';
hero.style.overflow = 'hidden';

// Create an effect container scoped strictly inside the hero section
const effectLayer = document.createElement('div');
effectLayer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
`;
hero.appendChild(effectLayer);

// Ensure hero content stays above the effects layer
const heroContent = hero.querySelector('.hero-content');
if (heroContent) {
    heroContent.style.position = 'relative';
    heroContent.style.zIndex = '2';
}

const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff3300', '#00ff66', '#ffffff'];
const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>+*=';

document.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    
    // Check if mouse is strictly inside the hero bounding box
    const isInHero = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top && e.clientY <= rect.bottom;

    if (!isInHero) return;

    // Calculate coordinates relative to the hero element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spawnGlowOrb(x, y);
    spawnGlitch(x, y);
});

function spawnGlowOrb(x, y) {
    const orb = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    orb.style.cssText = `
        position: absolute;
        left: ${x - 200}px;
        top: ${y - 200}px;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, ${color}, transparent 70%);
        filter: blur(80px);
        opacity: 0.3;
        pointer-events: none;
    `;
    effectLayer.appendChild(orb);
    
    let opacity = 0.3;
    const fade = () => {
        opacity -= 0.01;
        orb.style.opacity = opacity;
        if (opacity > 0) requestAnimationFrame(fade);
        else orb.remove();
    };
    fade();
}

function spawnGlitch(x, y) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isChar = Math.random() > 0.4;
    
    const size = Math.floor(Math.random() * 20) + 20; 

    el.style.cssText = `
        position: absolute;
        left: ${x - size/2}px;
        top: ${y - size/2}px;
        width: ${size}px;
        height: ${size}px;
        color: ${color};
        font-size: ${size}px;
        font-family: monospace;
        font-weight: bold;
        pointer-events: none;
        text-shadow: 0 0 10px ${color};
        opacity: 1;
    `;

    if (isChar) {
        el.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    } else {
        el.style.background = color;
    }

    effectLayer.appendChild(el);

    let opacity = 1;
    const fade = () => {
        opacity -= 0.03;
        el.style.opacity = opacity;
        if (opacity > 0) requestAnimationFrame(fade);
        else el.remove();
    };
    fade();
}
