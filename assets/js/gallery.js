const grid = document.querySelector('#grid');
const chipsRow = document.querySelector('#chips');
const searchInput = document.querySelector('#search');

let data = { assets: [] };
let currentCategory = 'all';

function renderGrid(assets, category = currentCategory) {
  const term = searchInput.value.trim().toLowerCase();
  const items = assets.filter((a) => {
    const matchCategory = category === 'all' || a.category === category;
    const matchSearch = !term
      || a.name.toLowerCase().includes(term)
      || a.tags.some((t) => t.toLowerCase().includes(term));
    return matchCategory && matchSearch;
  });

  grid.innerHTML = items.length
    ? items.map((a) => `
      <article class="card card--asset">
        <div class="preview-box">
          <img src="${a.preview}" alt="${a.name}" loading="lazy">
        </div>
        <div class="card--asset__body">
          <span class="badge">${a.category}</span>
          <h3>${a.name}</h3>
          <p>${a.description}</p>
          <div class="card--asset__actions">
            ${a.downloads.svg ? `<a class="btn" href="${a.downloads.svg}" download>SVG</a>` : ''}
            <a class="btn" href="${a.downloads.png}" download>PNG</a>
            ${a.downloads.zip ? `<a class="btn" href="${a.downloads.zip}" download>ZIP</a>` : ''}
            ${a.downloads.svg ? `<a class="btn btn--ghost" data-copy="${a.downloads.svg}">Copy path</a>` : ''}
          </div>
        </div>
      </article>
    `).join('')
    : '<p class="gallery-empty">Tidak ada asset yang cocok.</p>';
}

function renderChips() {
  const categories = ['all', ...new Set(data.assets.map((a) => a.category))];
  chipsRow.innerHTML = categories.map((c) => `
    <button type="button" class="chip" data-category="${c}"${c === currentCategory ? ' data-active' : ''}>
      ${c === 'all' ? 'All' : c}
    </button>
  `).join('');
}

fetch('./assets/data/assets.json')
  .then((res) => res.json())
  .then((json) => {
    data = json;
    renderChips();
    renderGrid(data.assets, 'all');
  });

chipsRow.addEventListener('click', (e) => {
  const chip = e.target.closest('[data-category]');
  if (!chip) return;
  currentCategory = chip.dataset.category;
  renderChips();
  renderGrid(data.assets, currentCategory);
});

searchInput.addEventListener('input', () => {
  renderGrid(data.assets, currentCategory);
});