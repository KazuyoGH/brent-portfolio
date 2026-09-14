document.addEventListener('mousemove', (e) => {
    const cursor = document.getElementById('cursor');
    const x = e.clientX;
    const y = e.clientY;

    // Smooth follow effect
    cursor.style.transform = `translate(${x - 100}px, ${y - 100}px)`;
});

// Optional: Add a "glitch" effect on hover for the title
const title = document.querySelector('.display-title');
title.addEventListener('mouseenter', () => {
    title.style.color = '#00ffff';
});
title.addEventListener('mouseleave', () => {
    title.style.color = '#ffffff';
});
