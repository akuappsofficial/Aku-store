// Database: App catalog
const appDatabase = [
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

// Generate HTML for an individual app card
function createAppCard(app) {
  return `
    <div class="app-card" onclick="openAppDetails('${app.id}')">
      <img src="${app.icon}" alt="${app.title} icon" class="app-icon">
      <div class="app-info">
        <h3 class="app-title">${app.title}</h3>
        <span class="app-developer">${app.developer}</span>
        <div class="app-meta">
          <span>${app.rating}</span>
          <span class="material-symbols-outlined star-icon">star</span>
          <span>• ${app.size}</span>
        </div>
      </div>
    </div>
  `;
}

// Inject app cards into the store grid
function renderAppGrid(apps) {
  const gridContainer = document.getElementById('appGridContainer');
  if (!gridContainer) return;

  if (apps.length === 0) {
    gridContainer.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1;">No apps found matching your query.</p>`;
    return;
  }

  gridContainer.innerHTML = '';
  apps.forEach(app => {
    gridContainer.innerHTML += createAppCard(app);
  });
}

// Navigation Tabs (Apps, Games, Recent)
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      
      const category = e.target.getAttribute('data-category');
      if (category === 'recent') {
        renderAppGrid(appDatabase);
      } else {
        const filteredApps = appDatabase.filter(app => app.category === category);
        renderAppGrid(filteredApps);
      }
    });
  });
}

// Search input handling
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const matchedApps = appDatabase.filter(app => 
      app.title.toLowerCase().includes(query) || 
      app.developer.toLowerCase().includes(query) ||
      app.id.toLowerCase().includes(query)
    );
    renderAppGrid(matchedApps);
  });
}

// Developer Console & Header Button Listeners
function setupHeaderActions() {
  const devDashboardBtn = document.getElementById('devDashboardBtn');
  if (devDashboardBtn) {
    devDashboardBtn.addEventListener('click', () => {
      const session = localStorage.getItem('aku_store_session');
      if (!session) {
        alert("Please sign in to access the developer console.");
        window.location.href = 'auth.html';
        return;
      }
      const user = JSON.parse(session);
      if (user.role === 'developer' || user.role === 'admin' || user.role === 'staff') {
        window.location.href = 'developer.html';
      } else {
        alert("Developer permissions required. Please submit an application from your Account page.");
        window.location.href = 'auth.html';
      }
    });
  }

  const userProfileBtn = document.getElementById('userProfileBtn');
  if (userProfileBtn) {
    userProfileBtn.addEventListener('click', () => {
      window.location.href = 'auth.html';
    });

    // Check session avatar
    const session = localStorage.getItem('aku_store_session');
    if (session) {
      const user = JSON.parse(session);
      if (user.avatar) {
        userProfileBtn.innerHTML = `<img src="${user.avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
      }
    }
  }
}

// Redirect to dynamic detail page
function openAppDetails(appId) {
  window.location.href = `app.html?id=${appId}`;
}

// Initialize on page load
window.onload = () => {
  renderAppGrid(appDatabase);
  setupTabs();
  setupSearch();
  setupHeaderActions();
};
