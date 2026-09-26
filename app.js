const appDatabase = [
  {
    id: "com.aku.vitsdemo",
    title: "VITS Demo Application",
    developer: "M. A. Akmal Ahamed",
    rating: 4.8,
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg", // Replace with real icons
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

// Function to generate the HTML for a single app card
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

// Function to inject apps into the grid
function renderAppGrid(apps) {
  const gridContainer = document.getElementById('appGridContainer');
  gridContainer.innerHTML = ''; // Clear loading states or old data
  
  apps.forEach(app => {
    gridContainer.innerHTML += createAppCard(app);
  });
}

// Navigation Tab Logic (Switch between Apps, Games, Recent)
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      // Remove active class from all
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked
      e.target.classList.add('active');
      
      // Filter the database based on the tab's data-category
      const category = e.target.getAttribute('data-category');
      if (category === 'recent') {
        renderAppGrid(appDatabase); // Just show all for 'recent' right now
      } else {
        const filteredApps = appDatabase.filter(app => app.category === category);
        renderAppGrid(filteredApps);
      }
    });
  });
}

// Function to handle clicking an app (Dynamic Routing prep)
function openAppDetails(appId) {
  // In Phase 3, this will redirect to a dedicated app page, e.g., app.html?id=com.aku.vitsdemo
  console.log(`Navigating to app details for: ${appId}`);
  alert(`Routing to details page for App ID: ${appId}`);
}

// Initialize the store when the page loads
window.onload = () => {
  renderAppGrid(appDatabase); // Load all apps initially
  setupTabs();
}; 
