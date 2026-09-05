const designs = [
    {
        name: "Colorful Implosion",
        brand: "Toyota",
        tags: ["RWD", "Anime", "Rare"],
        code: "631-187-591",
        thumbnail: "https://i.ibb.co/0VZS0ZZN/6-EC91-E61-DDFC-4-CFE-A843-1813-DD0-D136-C.png"
    },
    {
        name: "RE:Zero Ram",
        brand: "BMW",
        tags: ["Anime", "RWD", "Epic"],
        code: "819-669-727",
        thumbnail: "https://i.ibb.co/nMcn7kVj/3-E5851-FB-ADDE-43-F0-8-C0-D-E9-AAA7-F7-FD76.png"
    },
    {
        name: "ZZZ",
        brand: "Dodge",
        tags: ["Anime", "RWD", "Rare"],
        code: "699-2780772",
        thumbnail: "https://i.ibb.co/4RT8p160/B21-BAD25-56-F6-4-FDF-9-D2-C-7-DE9-BBC80-AFC.png"
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
