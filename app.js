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

window.copyCode = function(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied: ' + code);
    });
};

window.renderGallery = function(filter = 'all') {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    const filteredDesigns = filter === 'all' 
        ? designs 
        : designs.filter(d => d.brand === filter || d.tags.includes(filter));

    filteredDesigns.forEach(design => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${design.thumbnail}" alt="${design.name}" class="thumb">
            <div class="card-info">
                <h3 class="car-name">${design.name}</h3>
                <div class="tag-list">
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

window.initFilters = function() {
    const filterBar = document.getElementById('filter-bar');
    if (!filterBar) return;

    const brands = [...new Set(designs.map(d => d.brand))];
    const tags = [...new Set(designs.flatMap(d => d.tags))];
    const allFilters = [...brands, ...tags];

    allFilters.forEach(filter => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = filter;
        btn.dataset.filter = filter;
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            window.renderGallery(filter);
        };
        filterBar.appendChild(btn);
    });

    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) {
        allBtn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            allBtn.classList.add('active');
            window.renderGallery('all');
        };
    }
};

// Initialize on load
(function() {
    window.initFilters();
    window.renderGallery('all');
})();
