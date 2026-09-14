const header = document.querySelector('.site-header');
const hero = document.getElementById('hero-interactive');

// Create a full-page container for effects that spans from header top to hero bottom
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

// Ensure header and hero content stay clickable and above the effect layer
header.style.position = 'sticky';
header.style.zIndex = '100';

const heroContent = hero.querySelector('.hero-content');
if (heroContent) {
    heroContent.style.position = 'relative';
    heroContent.style.zIndex = '10';
}

const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff3300', '#00ff66', '#ffffff'];
const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&?!<>+*=';

document.addEventListener('mousemove', (e) => {
    const headerRect = header.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    
    // Total interactive bounds: top of header to bottom of hero
    const topLimit = headerRect.top + window.scrollY;
    const bottomLimit = heroRect.bottom + window.scrollY;
    const mousePageY = e.clientY + window.scrollY;

    const isInZone = mousePageY >= topLimit && mousePageY <= bottomLimit &&
                     e.clientX >= 0 && e.clientX <= window.innerWidth;

    if (!isInZone) return;

    // Use absolute page coordinates so effects place accurately anywhere on the page
    spawnGlowOrb(e.pageX, mousePageY);
    spawnGlitch(e.pageX, mousePageY);
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
        opacity: 0.4;
        pointer-events: none;
    `;
    effectLayer.appendChild(orb);
    
    let opacity = 0.4;
    let blur = 20; // start with a tighter blur
    
    const animate = () => {
        opacity -= 0.008;
        blur += 1.2; // gradually increase the blur
        
        orb.style.opacity = opacity > 0 ? opacity : 0;
        orb.style.filter = `blur(${blur}px)`;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            orb.remove();
        }
    };
    
    animate();
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
