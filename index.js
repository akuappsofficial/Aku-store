// Base Default Apps Database
const defaultDatabase = [
  {
    id: "com.aku.vitsdemo",
    title: "VITS Demo Application",
    developer: "M. A. Akmal Ahamed",
    rating: 4.8,
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
    category: "apps",
    size: "12 MB"
  },
  {
    id: "com.aku.sscknews",
    title: "SSCK News Portal",
    developer: "St. Sylvester's College",
    rating: 4.9,
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
    category: "apps",
    size: "8 MB"
  },
  {
    id: "com.viperfish.albion",
    title: "Viperfish Cartel Hub",
    developer: "A3 BROTHERS",
    rating: 4.5,
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
    category: "games",
    size: "45 MB"
  }
];

let activeCategory = "all";

// Merge default apps with developer-uploaded apps from LocalStorage
function getAllApps() {
  const customApps = JSON.parse(localStorage.getItem('aku_uploaded_apps') || '[]');
  return [...defaultDatabase, ...customApps];
}

// Render Grid Cards
function renderStoreGrid(filterText = "") {
  const grid = document.getElementById('appGrid');
  const allApps = getAllApps();

  const filtered = allApps.filter(app => {
    const matchesCategory = activeCategory === 'all' || app.category.toLowerCase() === activeCategory;
    const matchesSearch = app.title.toLowerCase().includes(filterText.toLowerCase()) || 
                          app.developer.toLowerCase().includes(filterText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); margin-top: 2rem;">No apps found matching your search.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(app => `
    <div class="app-card" onclick="openAppDetails('${app.id}')">
      <img src="${app.icon || 'https://via.placeholder.com/150'}" alt="${app.title}" class="app-icon">
      <div class="app-info">
        <span class="app-title">${app.title}</span>
        <span class="app-developer">${app.developer}</span>
        <div class="app-meta">
          <span>${app.rating || '5.0'}</span>
          <span class="material-symbols-outlined star-icon">star</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Navigate to detail page
function openAppDetails(appId) {
  window.location.href = `app.html?id=${encodeURIComponent(appId)}`;
}

// Event Listeners for Tabs
document.querySelectorAll('.category-tabs .tab').forEach(tabBtn => {
  tabBtn.addEventListener('click', (e) => {
    document.querySelectorAll('.category-tabs .tab').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    activeCategory = e.target.getAttribute('data-category');
    document.getElementById('gridTitle').innerText = 
      activeCategory === 'all' ? 'Recommended Apps' : `${activeCategory.toUpperCase()} Selection`;
    
    const searchText = document.getElementById('searchInput').value;
    renderStoreGrid(searchText);
  });
});

// Live Search Listener
document.getElementById('searchInput').addEventListener('input', (e) => {
  renderStoreGrid(e.target.value.trim());
});

// Navigation Links
document.getElementById('userProfileBtn').addEventListener('click', () => {
  window.location.href = 'auth.html';
});

document.getElementById('homeLogo').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Initial Render
window.onload = () => {
  renderStoreGrid();
}; 
