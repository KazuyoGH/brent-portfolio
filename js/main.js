const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic — soft deceleration
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// --- Initial loading sequence ---
async function startLoadingSequence() {
    const textEl = document.getElementById('loader-text');
    const loader = document.getElementById('loader');
    const sentence = "hey, glad to have you here! my name is..";

    textEl.textContent = sentence;

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
        initSubtitleCycle();
    }, 1000);
}


// Run immediately
startLoadingSequence();

const header = document.querySelector('.site-header');
const effectLayer = document.createElement('div');
effectLayer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
`;
document.body.appendChild(effectLayer);


const hero = document.getElementById('hero-interactive');

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

const heroTitle = document.querySelector('#hero-interactive h1');
heroTitle.style.transition = 'filter 0.08s linear';
let targetRotateX = 0;
let targetRotateY = 0;
let currentRotateX = 0;
let currentRotateY = 0;
let prevRotateX = 0;
let prevRotateY = 0;

document.addEventListener('mousemove', (e) => {
    if (heroTitle) {
        const rect = heroTitle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        targetRotateY = deltaX * 12;
        targetRotateX = deltaY * -12;
    }

    // ── Trail spawn across the whole page ──
    const mousePageY = e.clientY + window.scrollY;
    const docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );

    const isInZone = e.clientY >= 0 && e.clientY <= window.innerHeight &&
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
    spawnGlowOrb(e.clientX, e.clientY);
    for (let i = 0; i < count; i++) {
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        spawnTrailElement(e.clientX + offsetX, e.clientY + offsetY);
    }
});

function animateParallax() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.08;
    currentRotateY += (targetRotateY - currentRotateY) * 0.08;

    if (heroTitle) {
        heroTitle.style.transform = `perspective(800px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

        // Move the pseudo-layer opposite to the mouse direction.
        // The multiplier controls how much "depth" the text appears to have.
        const depthFactor = 4; // adjust depth intensity here
        const offsetX = -(targetRotateY / 12) * depthFactor;
        const offsetY = (targetRotateX / 12) * depthFactor;

        heroTitle.style.setProperty('--extrude-x', `${offsetX}px`);
        heroTitle.style.setProperty('--extrude-y', `${offsetY}px`);

        // Visual motion — how much rotation changed since last frame
        const dx = currentRotateX - prevRotateX;
        const dy = currentRotateY - prevRotateY;
        const visualSpeed = Math.sqrt(dx * dx + dy * dy);

        // Blur only when the text is actually moving visually
        const blurAmount = visualSpeed > 0.15
            ? Math.min(visualSpeed * 2.5, 6)
            : 0;

        heroTitle.style.filter = `blur(${blurAmount}px)`;

        prevRotateX = currentRotateX;
        prevRotateY = currentRotateY;
    }

    requestAnimationFrame(animateParallax);
}

animateParallax();


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
    const revealSections = document.querySelectorAll('#hero-interactive, .about-section, .projects-section, .contact-section');

    revealSections.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.filter = 'blur(8px)';
        el.style.transform = 'translateY(60px)';
        el.style.transition = `opacity 2.3s cubic-bezier(0.1, 0.9, 0.2, 1), filter 0.8s cubic-bezier(0.1, 0.9, 0.2, 1), transform 0.8s cubic-bezier(0.1, 0.9, 0.2, 1)`;
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

function initSubtitleCycle() {
    const items = document.querySelectorAll('.subtitle-item');
    let currentIndex = 0;

    function updateCarousel() {
        items.forEach((item, index) => {
            item.className = 'subtitle-item';

            if (index === currentIndex) {
                item.classList.add('active');
            } else if (index === (currentIndex - 1 + items.length) % items.length) {
                item.classList.add('prev');
            } else if (index === (currentIndex + 1) % items.length) {
                item.classList.add('next');
            } else {
                item.classList.add('hidden');
            }
        });

        currentIndex = (currentIndex + 1) % items.length;
    }

    setInterval(updateCarousel, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadAboutFromYaml();

    const switchBtns = document.querySelectorAll('.switch-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const slider = document.querySelector('.switch-slider');

    function updateSlider(activeBtn) {
        slider.style.width = `${activeBtn.offsetWidth}px`;
        slider.style.left = `${activeBtn.offsetLeft}px`;
    }

    switchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            btn.classList.add('active');
            updateSlider(btn);

            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Initialize on load
    const activeBtn = document.querySelector('.switch-btn.active') || switchBtns;
    if (activeBtn) {
        updateSlider(activeBtn);
    }
});

async function loadAboutFromYaml() {
    try {
        const res = await fetch('about.yaml');
        const text = await res.text();
        const data = jsyaml.load(text);

        // Render bio
        document.getElementById('about-bio').innerHTML = data.bio;

        // Render each tab (renderTab stays the same from before)
        renderTab('experience', data.experience);
        renderTab('education', data.education);
        renderTab('extracurricular', data.extracurricular);

    } catch (err) {
        console.error('YAML load failed:', err);
    }
}

function renderTab(tabId, items) {
    const container = document.getElementById(tabId);
    container.innerHTML = items.map(item => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-card">
                <h3>${item.title}</h3>
                <div class="timeline-meta">
                    <span>${item.period}</span>
                    <span>${item.location}</span>
                    <span>${item.organization}</span>
                </div>
                <ul class="timeline-bullets">
                    ${item.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const email = copyBtn.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(() => {
                copyBtn.textContent = 'email copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'email';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});
