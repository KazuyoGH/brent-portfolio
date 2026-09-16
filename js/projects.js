// projects.html
async function loadProjectsData() {
    try {
        // Fetch projects and featured list simultaneously
        const [projRes, featRes] = await Promise.all([
            fetch('../data/projects.yml'),
            fetch('../data/featured.yml')
        ]);

        const projText = await projRes.text();
        const featText = await featRes.text();

        const projects = jsyaml.load(projText) || [];
        const featuredData = jsyaml.load(featText) || { featured_slugs: [] };

        renderFeatured(projects, featuredData.featured_slugs);
        renderAllProjects(projects);
    } catch (error) {
        console.error("Error loading project YAML data:", error);
    }
}

function renderFeatured(projects, featuredSlugs) {
    const container = document.getElementById('featured-grid');
    if (!container) return;

    if (!featuredSlugs || featuredSlugs.length === 0) {
        container.innerHTML = `<p class="nothing-to-show">nothing to show right now!</p>`;
        return;
    }

    const featuredProjects = projects.filter(p => featuredSlugs.includes(p.slug));

    if (featuredProjects.length === 0) {
        container.innerHTML = `<p class="nothing-to-show">nothing to show right now!</p>`;
        return;
    }

    container.innerHTML = featuredProjects.map(p => createProjectCardHTML(p)).join('');
}

function renderAllProjects(projects, activeTag = 'All') {
    const gridContainer = document.getElementById('all-projects-grid');
    const filtersContainer = document.getElementById('tag-filters');
    if (!gridContainer) return;

    // Extract all unique tags across all projects
    const allTags = ['All', ...new Set(projects.flatMap(p => p.tags))];

    // Render filter buttons matching your design style
    if (filtersContainer) {
        filtersContainer.innerHTML = allTags.map(tag => `
            <button class="tag-switch ${tag === activeTag ? 'active' : ''}" onclick="filterTag('${tag}')">
                ${tag}
            </button>
        `).join('');
    }

    // Filter projects based on selection
    const filtered = activeTag === 'All' 
        ? projects 
        : projects.filter(p => p.tags.includes(activeTag));

    gridContainer.innerHTML = filtered.length > 0 
        ? filtered.map(p => createProjectCardHTML(p)).join('')
        : `<p class="nothing-to-show">No projects found with this tag.</p>`;
}

function createProjectCardHTML(project) {
    return `
        <a href="projects/template.html?slug=${project.slug}" class="project-card">
            <div class="project-image-wrap">
                <img src="${project.thumbnail}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3 class="project-card-title">${project.title}</h3>
                <p class="project-card-subtitle">${project.subtitle}</p>
                <div class="project-card-tags">
                    ${project.tags.map(t => `<span class="project-tag-pill">${t}</span>`).join('')}
                </div>
            </div>
        </a>
    `;
}


// Global scope tracker for filters
let globalProjectsCache = [];
async function initPortfolio() {
    const projRes = await fetch('../data/projects.yml');
    const text = await projRes.text();
    globalProjectsCache = jsyaml.load(text) || [];
    
    const featRes = await fetch('../data/featured.yml');
    const featText = await featRes.text();
    const featuredData = jsyaml.load(featText) || { featured_slugs: [] };

    renderFeatured(globalProjectsCache, featuredData.featured_slugs);
    renderAllProjects(globalProjectsCache, 'All');
}

window.filterTag = function(tag) {
    renderAllProjects(globalProjectsCache, tag);
};

document.addEventListener('DOMContentLoaded', initPortfolio);
