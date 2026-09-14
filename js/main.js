document.addEventListener('mousemove', (e) => {
    const cursor = document.getElementById('cursor');
    const x = e.clientX;
    const y = e.clientY;

    // Centers the 300px gradient directly on the cursor
    cursor.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
});

const title = document.querySelector('.display-title');
title.addEventListener('mouseenter', () => {
    title.style.color = '#00ffff';
});
title.addEventListener('mouseleave', () => {
    title.style.color = '#ffffff';
});
