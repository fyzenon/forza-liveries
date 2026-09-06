const activeFilters = new Set();

window.showToast = function(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => {
        t.classList.add('fade-out');
        setTimeout(() => t.remove(), 500);
    }, 2000);
};

window.copyCode = function(code) {
    navigator.clipboard.writeText(code).then(() => window.showToast('Code copied!'));
};

window.renderGallery = function(designsToRender = window.designs) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    gallery.innerHTML = '';

    designsToRender.forEach(d => {
        const card = document.createElement('div');
        card.className = 'card';
        const sortedTags = [...d.tags].sort();
        card.innerHTML = `
            <img src="${d.thumbnail}" alt="${d.name}" class="card-img">
            <div class="card-content">
                <div class="card-header">
                    <span class="card-make">${d.make}</span>
                    <span class="card-year">${d.year}</span>
                </div>
                <h3 class="card-title">${d.name}</h3>
                <p class="card-model">${d.model}</p>
                <div class="card-tags">
                    ${sortedTags.map(t => `<span class="tag" onclick="window.handleTagFilter('${t}')">${t}</span>`).join('')}
                </div>
                <div class="card-footer">
                    <span class="card-drive">${d.drivetrain}</span>
                    <button class="copy-btn" onclick="window.copyCode('${d.code}')">Copy Code</button>
                </div>
            </div>
        `;
        gallery.appendChild(card);
    });
};

window.filterDesigns = function() {
    const makeTerm = (document.getElementById('filter-make')?.value || '').toLowerCase();
    const yearTerm = (document.getElementById('filter-year')?.value || '').toLowerCase();
    const driveTerm = document.getElementById('filter-drive')?.value || '';

    const filtered = window.designs.filter(d => {
        const matchMake = !makeTerm || d.make.toLowerCase().includes(makeTerm);
        const matchYear = !yearTerm || d.year.toString().toLowerCase().includes(yearTerm);
        const matchDrive = !driveTerm || d.drivetrain === driveTerm;
        const matchTags = activeFilters.size === 0 || [...activeFilters].every(f => d.tags.includes(f));
        return matchMake && matchYear && matchDrive && matchTags;
    });
    window.renderGallery(filtered);
};

window.handleTagFilter = function(tag) {
    activeFilters.has(tag) ? activeFilters.delete(tag) : activeFilters.add(tag);
    window.filterDesigns();
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.designs) window.renderGallery();
    else console.error('No designs data found.');
});