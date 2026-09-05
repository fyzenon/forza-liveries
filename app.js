let activeFilters = new Set();

window.copyCode = function(code) {
    navigator.clipboard.writeText(code).then(() => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = 'Copied: ' + code;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    });
};

window.renderGallery = function(designsToRender = window.designs) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    const filteredDesigns = designsToRender.filter(d => {
        if (activeFilters.size === 0) return true;
        return Array.from(activeFilters).every(filter => 
            d.make === filter || d.tags.includes(filter)
        );
    });

    if (filteredDesigns.length === 0) {
        gallery.innerHTML = '<div style="text-align:center; grid-column: 1/-1; color: var(--text-dim); padding: 3rem;">No designs match these filters.</div>';
        return;
    }

    filteredDesigns.forEach(design => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${design.thumbnail}" alt="${design.model}" class="thumbnail">
            <div class="card-content">
                <div class="car-info">
                    <span class="car-year">${design.year}</span>
                    <h3 class="car-name">${design.make} ${design.model}</h3>
                </div>
                <div class="tags">
                    ${design.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="share-section">
                    <span class="share-code">${design.code}</span>
                    <button class="copy-btn" onclick="copyCode('${design.code}')">Copy</button>
                </div>
            </div>
        `;
        gallery.appendChild(card);
    });
};

window.filterDesigns = function() {
    const makeQuery = document.getElementById('filter-make').value.toLowerCase();
    const yearQuery = document.getElementById('filter-year').value;
    const driveQuery = document.getElementById('filter-drive').value;

    const filtered = designs.filter(d => {
        const matchMake = !makeQuery || d.make.toLowerCase().includes(makeQuery);
        const matchYear = !yearQuery || d.year.toString() === yearQuery;
        const matchDrive = !driveQuery || d.drivetrain === driveQuery;
        return matchMake && matchYear && matchDrive;
    });

    window.renderGallery(filtered);
};

function updateFilterUI() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const val = btn.textContent;
        if (val === 'All') {
            btn.classList.add('active');
        } else if (activeFilters.has(val)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

window.initFilters = function() {
    const filterBar = document.getElementById('filter-bar');
    if (!filterBar) return;

    filterBar.innerHTML = '';

    const makes = [...new Set(designs.map(d => d.make))];
    const tags = [...new Set(designs.flatMap(d => d.tags))];
    const allOptions = [...makes, ...tags];



    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.textContent = 'All';
    allBtn.onclick = () => {
        activeFilters.clear();
        updateFilterUI();
        window.renderGallery();
    };
    filterBar.appendChild(allBtn);

    allOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = opt;
        btn.onclick = () => {
            if (activeFilters.has(opt)) {
                activeFilters.delete(opt);
            } else {
                activeFilters.add(opt);
            }
            updateFilterUI();
            window.renderGallery();
        };
        filterBar.appendChild(btn);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    window.renderGallery();
    window.initFilters();
});