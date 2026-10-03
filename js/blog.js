// js/blog.js
async function loadBlogPosts() {
    const container = document.getElementById('blog-list');
    if (!container) return;

    try {
        const response = await fetch('data/blog.yml');
        if (!response.ok) throw new Error(`Could not load blog.yml: ${response.status}`);

        const posts = jsyaml.load(await response.text()) || [];

        if (posts.length === 0) {
            container.innerHTML = '<p class="nothing-to-show">No blog posts yet.</p>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <a class="blog-card" href="blog/template.html?slug=${encodeURIComponent(post.slug)}">
                <div class="blog-card-info">
                    <h2>${escapeHTML(post.title)}</h2>
                    <p class="blog-card-date">${escapeHTML(post.date || '')}</p>
                    <p class="blog-card-excerpt">${escapeHTML(post.excerpt || '')}</p>
                </div>
                <div class="blog-card-image">
                    ${post.thumbnail
                        ? `<img src="${escapeHTML(post.thumbnail)}" alt="${escapeHTML(post.title)}">`
                        : ''}
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading blog posts:', error);
        container.innerHTML = '<p class="nothing-to-show">Could not load blog posts.</p>';
    }
}

function escapeHTML(value = '') {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);
