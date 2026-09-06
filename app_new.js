/**
 * OpenClaude Site Logic
 * Handles gallery rendering, filtering, and design copying
 */

// Helper for toast notifications
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

// Copy code to clipboard
window.copyCode = async function(code) {
    try {
        await navigator.clipboard.writeText(code);
        window.showToast('Code copied!');
    } catch (err) {
        console.error('Failed to copy: ', err);
        window.showToast('Failed to copy code');
    }
};

// Render the gallery of designs
window.renderGallery = function(designsToRender = window.designs) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    gallery.innerHTML = '';

    if (!designsToRender || designsToRender.length === 0) {
        gallery.innerHTML = '<div class="no-results">No designs found matching your criteria.</div>';
        return;
    }

    designsToRender.forEach(d => {
        const card = document.createElement('div');
        card.className = 'card';
        const sortedTags = [...d.tags].sort();
        // Escape backticks and quotes for the inline onclick handler
        const escapedCode = d.code.replace(/`/g, '\`').replace(/"/g, '&quot;'); 
        
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
                    <button class="copy-btn" onclick="window.copyCode(`${escapedCode})