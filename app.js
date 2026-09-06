/**
 * OpenClaude Site Logic
 * Handles gallery rendering, filtering, and design copying
 */

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

window.copyCode = async function(code) {
    try {
        await navigator.clipboard.writeText(code);
        window.showToast('Code copied!');
    } catch (err) {
        window.showToast('Failed to copy code');
    }
};

window.renderGallery = function(designsToRender) {
    const data = designsToRender || window.designs || [];
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    if (data.length === 0) {
        gallery.innerHTML = '<div class="no-results">No designs found matching your criteria.</div>';
        return;
    }

    data.forEach(d => {
        const card = document.createElement('div');
        card.className = 'card';
        const sortedTags = [...(d.tags || [])].sort();
        const escapedCode = (d.code || '').replace(/`/g, '\`').replace(/"/g, '&quot;'); 
        
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
                    <button class="copy-btn" onclick="window.copyCode(`${escapedCode})">Copy Code</button>
                </div>
            </div>
        `;
        gallery.appendChild(card);
    });
};

window.handleTagFilter = function(tag) {
    const filtered = window.designs.filter(d => d.tags && d.tags.includes(tag));
    window.renderGallery(filtered);
};

(function() {
    const initFilters = () => {
        const makeInput = document.getElementById('filter-make');
        const yearInput = document.getElementById('filter-year');
        const driveSelect = document.getElementById('filter-drive');
        if (!makeInput || !yearInput || !driveSelect) return;

        const runFilters = () => {
            const makeVal = makeInput.value.toLowerCase();
            const yearVal = yearInput.value.trim();
            const driveVal = driveSelect.value;

            const filtered = window.designs.filter(d => {
                const matchMake = !makeVal || d.make.toLowerCase().includes(makeVal);
                const matchYear = !yearVal || d.year.toString().includes(yearVal);
                const matchDrive = !driveVal || d.drivetrain === driveVal;
                return matchMake && matchYear && matchDrive;
            });
            window.renderGallery(filtered);
        };
        makeInput.addEventListener('input', runFilters);
        yearInput.addEventListener('input', runFilters);
        driveSelect.addEventListener('change', runFilters);
    };
    initFilters();
})();

window.copyCode = function(code) {
    navigator.clipboard.writeText(code).then(() => {
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        setTimeout(() => btn.innerText = originalText, 2000);
    });
};

fetch('data/designs.json')
    .then(res => res.json())
    .then(data => {
        window.designs = data;
        window.renderGallery(data);
    })
    .catch(err => {
        console.error('Error loading designs:', err);
        document.getElementById('gallery').innerHTML = '<div class="error">Failed to load design gallery.</div>';
    });