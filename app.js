/**
 * OpenClaude Site Logic
 * Handles gallery rendering, filtering, and design copying
 */

window.designs = [];

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
    navigator.clipboard.writeText(code).then(() => {
        window.showToast('Code copied!');
    });
};

window.renderGallery = function(designsToRender = window.designs) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    gallery.innerHTML = '';

    if (designsToRender.length === 0) {
        gallery.innerHTML = '<div class="no-results">No designs found matching your criteria.</div>';
        return;
    }

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
    const tagTerm = (document.getElementById('filter-tag-input')?.value || '').toLowerCase();

    const filtered = window.designs.filter(d => {
        const matchMake = !makeTerm || d.make.toLowerCase().includes(makeTerm);
        const matchYear = !yearTerm || d.year.toString().toLowerCase().includes(yearTerm);
        const matchDrive = !driveTerm || d.drivetrain === driveTerm;
        const matchTags = !tagTerm || d.tags.some(t => t.toLowerCase().includes(tagTerm));
        return matchMake && matchYear && matchDrive && matchTags;
    });
    window.renderGallery(filtered);
};

window.handleTagFilter = function(tag) {
    const tagInput = document.getElementById('filter-tag-input');
    if (tagInput) {
        tagInput.value = tag;
    }
    window.filterDesigns();
};

window.showToast = function(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
};

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', window.filterDesigns);
    }
    
    const makeFilter = document.getElementById('filter-make');
    if (makeFilter) {
        makeFilter.addEventListener('input', window.filterDesigns);
    }
    
    const yearFilter = document.getElementById('filter-year');
    if (yearFilter) {
        yearFilter.addEventListener('input', window.filterDesigns);
    }
    
    const driveFilter = document.getElementById('filter-drive');
    if (driveFilter) {
        driveFilter.addEventListener('change', window.filterDesigns);
    }

    const tagFilterInput = document.getElementById('filter-tag-input');
    if (tagFilterInput) {
        tagFilterInput.addEventListener('input', window.filterDesigns);
    }

    window.renderGallery();
});