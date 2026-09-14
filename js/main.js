// Pixel trail — only spawns inside the hero section
const hero = document.getElementById('hero-interactive');
const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff3300', '#00ff66', '#ffffff'];

// Throttle — only spawn every Nth mousemove to keep performance clean
let frameCount = 0;

document.addEventListener('mousemove', (e) => {
    frameCount++;

    // Check if cursor is inside the hero's bounding box
    const rect = hero.getBoundingClientRect();
    const isInHero = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top && e.clientY <= rect.bottom;

    if (!isInHero) return;

    // Skip every 2nd frame to avoid flooding the DOM
    if (frameCount % 2 !== 0) return;

    spawnPixel(e.clientX, e.clientY);
});

function spawnPixel(x, y) {
    const pixel = document.createElement('div');

    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.floor(Math.random() * 8) + 4; // 4–12px

    pixel.style.cssText = `
        position: fixed;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        image-rendering: pixelated;
    `;

    document.body.appendChild(pixel);

    // Fade out over ~20 frames
    let opacity = 1;
    const fade = () => {
        opacity -= 0.05;
        if (opacity <= 0) {
            pixel.remove();
            return;
        }
        pixel.style.opacity = opacity;
        requestAnimationFrame(fade);
    };
    requestAnimationFrame(fade);

    // Safety removal
    setTimeout(() => { if (pixel.parentNode) pixel.remove(); }, 600);
}

// Title glitch hover stays
const title = document.querySelector('.display-title');
title.addEventListener('mouseenter', () => {
    title.style.color = '#00ffff';
});
title.addEventListener('mouseleave', () => {
    title.style.color = '#ffffff';
});
