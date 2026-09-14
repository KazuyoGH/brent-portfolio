// --- Initial loading sequence ---
async function startLoadingSequence() {
    const textEl = document.getElementById('loader-text');
    const loader = document.getElementById('loader');
    const words = ["hey,", "glad", "to", "have", "you", "here!", "my", "name", "is..."];

    // 1. Text pop-in
    for (const word of words) {
        textEl.textContent = word;
        await new Promise(r => setTimeout(r, 400));
    }
    
    // 2. Short pause
    await new Promise(r => setTimeout(r, 600));

    // 3. Pixelate-out effect
    // By combining high blur and high contrast, we get a "pixel-like" disintegration
    loader.style.filter = 'blur(20px) contrast(20)';
    loader.style.opacity = '0';

    // 4. Remove from DOM
    setTimeout(() => {
        loader.remove();
        nitScrollReveal();   // <-- Start scroll reveals only after loader is gone
    }, 1000);

}

// Run immediately
async function startLoadingSequence() {
    const textEl = document.getElementById('loader-text');
    const loader = document.getElementById('loader');
    const sentence = "hey, glad to have you here! my name is..";

    // Set full text immediately
    textEl.textContent = sentence;

    // Start state: hidden, blurred, pushed down
    textEl.style.opacity = '0';
    textEl.style.filter = 'blur(10px)';
    textEl.style.transform = 'translateY(40px)';
    textEl.style.transition = 'opacity 0.8s ease-out, filter 0.8s ease-out, transform 0.8s ease-out';

    // Brief pause before it begins
    await new Promise(r => setTimeout(r, 400));

    // Animate in: sharpens, fades in, slides up
    textEl.style.opacity = '1';
    textEl.style.filter = 'blur(0px)';
    textEl.style.transform = 'translateY(0)';

    // Let it sit visible for a moment
    await new Promise(r => setTimeout(r, 2000));

    // Pixelate-out effect
    loader.style.filter = 'blur(20px) contrast(20)';
    loader.style.opacity = '0';

    // Remove loader, then reveal page sections
    setTimeout(() => {
        loader.remove();
        initScrollReveal();
    }, 1000);
}


const MAX_ELEMENTS = 60;

const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff3300', '#00ff66', '#ffffff'];
const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>+*=';
const codeSnippets = [
    '<div>', '</div>', 'class="hero"', 'const', 'import',
    'style.css', 'main.js', 'index.html', 'function()',
    '->', '===', '{ }', 'padding: 4vw;', 'portfolio'
];

// --- Distance-based spawning ---
const SPAWN_DISTANCE = 25;
let lastMouseX = 0;
let lastMouseY = 0;
let accumulatedDistance = 0;

// --- Mouse parallax for "brent feir" ---
const heroTitle = document.querySelector('#hero-interactive h1');

document.addEventListener('mousemove', (e) => {
    // ── Parallax tilt (runs everywhere, not just hero zone) ──
    if (heroTitle) {
        const rect = heroTitle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);   // -1 to 1
        const deltaY = (e.clientY - centerY) / (rect.height / 2);  // -1 to 1

        const rotateY = deltaX * 12;  // max ±12° sideways tilt
        const rotateX = deltaY * -12; // inverted so mouse down = tilts toward you

        heroTitle.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        heroTitle.style.transition = 'transform 0.1s ease-out';
    }

    // ── Existing zone check + trail spawn ──
    const headerRect = header.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    const topLimit = headerRect.top + window.scrollY;
    const bottomLimit = heroRect.bottom + window.scrollY;
    const mousePageY = e.clientY + window.scrollY;

    const isInZone = mousePageY >= topLimit && mousePageY <= bottomLimit &&
                     e.clientX >= 0 && e.clientX <= window.innerWidth;

    if (!isInZone) return;

    const dx = e.pageX - lastMouseX;
    const dy = mousePageY - lastMouseY;
    accumulatedDistance += Math.sqrt(dx * dx + dy * dy);

    if (accumulatedDistance < SPAWN_DISTANCE) return;

    accumulatedDistance = 0;
    lastMouseX = e.pageX;
    lastMouseY = mousePageY;

    while (effectLayer.children.length > MAX_ELEMENTS) {
        effectLayer.firstChild.remove();
    }

    const count = Math.floor(Math.random() * 2) + 2;
    spawnGlowOrb(e.pageX, mousePageY);
    for (let i = 0; i < count; i++) {
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        spawnTrailElement(e.pageX + offsetX, mousePageY + offsetY);
    }
});


function spawnGlowOrb(x, y) {
    const size = 200 + Math.random() * 600;
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
        orb.style.transition = 'opacity 3.5s cubic-bezier(0.1, 1, 0.1, 1), filter 1.8s cubic-bezier(0.1, 1, 0.1, 1)';
        orb.style.opacity = '0';
        orb.style.filter = 'blur(140px)';
    });

    setTimeout(() => orb.remove(), 3700);
}

function spawnTrailElement(x, y) {
    const roll = Math.random();
    const color = colors[Math.floor(Math.random() * colors.length)];

    if (roll < 0.33) {
        // --- Colored square ---
        const size = Math.floor(Math.random() * 14) + 14;
        const el = document.createElement('div');
        el.style.cssText = `
            position: absolute;
            left: ${x - size / 2}px;
            top: ${y - size / 2}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            pointer-events: none;
            box-shadow: 0 0 10px ${color};
            opacity: 1;
            will-change: opacity;
        `;
        effectLayer.appendChild(el);
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.4s ease-out';
            el.style.opacity = '0';
        });
        setTimeout(() => el.remove(), 450);

    } else if (roll < 0.66) {
        // --- Random glitch character ---
        const size = Math.floor(Math.random() * 20) + 20;
        const el = document.createElement('div');
        el.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        el.style.cssText = `
            position: absolute;
            left: ${x - size / 2}px;
            top: ${y - size / 2}px;
            color: ${color};
            font-size: ${size}px;
            font-family: monospace;
            font-weight: bold;
            pointer-events: none;
            text-shadow: 0 0 10px ${color};
            opacity: 1;
            will-change: opacity;
        `;
        effectLayer.appendChild(el);
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.4s ease-out';
            el.style.opacity = '0';
        });
        setTimeout(() => el.remove(), 450);

    } else {
        // --- Code snippet ---
        const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        const fontSize = Math.floor(Math.random() * 12) + 14;
        const el = document.createElement('div');
        el.textContent = snippet;
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
        if (Math.random() > 0.6) {
            el.style.background = 'rgba(255, 255, 255, 0.05)';
            el.style.border = `1px solid ${color}`;
            el.style.padding = '2px 6px';
            el.style.borderRadius = '3px';
        }
        effectLayer.appendChild(el);
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            el.style.opacity = '0';
            el.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${(Math.random() - 0.5) * 60}px)`;
        });
        setTimeout(() => el.remove(), 700);
    }
}

// ── Scroll reveal: major sections fade + blur in ──
function initScrollReveal() {
    const revealSections = document.querySelectorAll('#hero-interactive, .about-section, .projects-section, .contact-section, section');

    revealSections.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.filter = 'blur(8px)';
        el.style.transform = 'translateY(60px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.1, 0.9, 0.2, 1), filter 0.8s cubic-bezier(0.1, 0.9, 0.2, 1), transform 0.8s cubic-bezier(0.1, 0.9, 0.2, 1)`;
        el.style.transitionDelay = `${i * 0.1}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.filter = 'blur(0px)';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealSections.forEach((el) => revealObserver.observe(el));
}
