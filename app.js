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

    if (designsToRender.length === 0) {
        gallery.innerHTML = '<div style="text-align:center; grid-column: 1/-1; color: var(--text-dim); padding: 3rem;">No designs match these filters.</div>';
        return;
    }

    designsToRender.forEach(design => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${design.thumbnail}" alt="${design.model}" class="thumbnail">
            <div class="card-content">
                <div class="car-info">
                    <span class="car-year">${design.year}</span>
                    <h3 class="car-name">${design.make} ${design.model}</h3>
                    <div class="design-name">${design.name}</div>
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

window.initFilters = function() {
    const makeList = document.getElementById('makes-list');
    const yearList = document.getElementById('years-list');
    if (!makeList || !yearList) return;

    const uniqueMakes = [...new Set(designs.map(d => d.make))].sort();
    const uniqueYears = [...new Set(designs.map(d => d.year))].sort((a, b) => b - a);

    uniqueMakes.forEach(make => {
        const opt = document.createElement('option');
        opt.value = make;
        makeList.appendChild(opt);
    });

    uniqueYears.forEach(year => {
        const opt = document.createElement('option');
        opt.value = year;
        yearList.appendChild(opt);
    });
};