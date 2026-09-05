const designs = [
    {
        name: "Ferrari F40",
        brand: "Ferrari",
        tags: ["Classic", "Red"],
        code: "123-456-789",
        thumbnail: "artifacts/imgs/img_1788487621849.png"
    },
    {
        name: "Porsche 911 GT3",
        brand: "Porsche",
        tags: ["Modern", "Track"],
        code: "654-321-987",
        thumbnail: "artifacts/imgs/img_1788487621849.png"
    },
    {
        name: "McLaren 720S",
        brand: "McLaren",
        tags: ["Modern", "Neon"],
        code: "321-654-987",
        thumbnail: "artifacts/imgs/img_1788487621849.png"
    }
];

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

window.renderGallery = function() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    const filteredDesigns = designs.filter(d => {
        if (activeFilters.size === 0) return true;
        return Array.from(activeFilters).every(filter => 
            d.brand === filter || d.tags.includes(filter)
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
            <img src="${design.thumbnail}" alt="${design.name}" class="thumbnail">
            <div class="card-content">
                <h3 class="car-name">${design.name}</h3>
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

    const brands = [...new Set(designs.map(d => d.brand))];
    const tags = [...new Set(designs.flatMap(d => d.tags))];
    const allOptions = [...brands, ...tags];

    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.textContent = 'All';
    allBtn.onclick = () => {
        activeFilters.clear();
        updateFilterUI();
        window.renderGallery();
    };
    filterBar.appendChild(allBtn);

    allOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = option;
        btn.onclick = () => {
            const brands = [...new Set(designs.map(d => d.brand))];
            if (brands.includes(option)) {
                brands.forEach(b => { if(b !== option) activeFilters.delete(b); });
                if (activeFilters.has(option)) {
                    activeFilters.delete(option);
                } else {
                    activeFilters.add(option);
                }
            } else {
                if (activeFilters.has(option)) {
                    activeFilters.delete(option);
                } else {
                    activeFilters.add(option);
                }
            }
            updateFilterUI();
            window.renderGallery();
        };
        filterBar.appendChild(btn);
    });
};

// Initial load
window.initFilters();
window.renderGallery();