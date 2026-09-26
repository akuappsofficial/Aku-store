// Extended mock database including GitHub raw APK links, descriptions, and screenshots
const extendedDatabase = [
  {
    id: "com.aku.vitsdemo",
    title: "VITS Demo Application",
    developer: "M. A. Akmal Ahamed",
    rating: 4.8,
    size: "12 MB",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
    apkUrl: "https://github.com/AkmalTheCoder93N/raw-storage/releases/download/v1.0/app-release.apk", // GitHub APK link target
    description: "Official VITS demonstration application built for showcase testing. Features real-time sync, lightweight asset loading, and optimized local client rendering.",
    screenshots: [
      "https://via.placeholder.com/300x600/303134/ffffff?text=Screen+1",
      "https://via.placeholder.com/300x600/303134/ffffff?text=Screen+2",
      "https://via.placeholder.com/300x600/303134/ffffff?text=Screen+3"
    ]
  },
  {
    id: "com.aku.sscknews",
    title: "SSCK News Portal",
    developer: "St. Sylvester's College",
    rating: 4.9,
    size: "8 MB",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
    apkUrl: "#",
    description: "Official news and event management application for St. Sylvester's College Kandy. Stay updated on academic announcements, sports meets, and societies.",
    screenshots: [
      "https://via.placeholder.com/300x600/303134/ffffff?text=News+Feed",
      "https://via.placeholder.com/300x600/303134/ffffff?text=Events"
    ]
  },
  {
    id: "com.viperfish.albion",
    title: "Viperfish Cartel Hub",
    developer: "A3 BROTHERS",
    rating: 4.5,
    size: "45 MB",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
    apkUrl: "#",
    description: "Tactical guild manager and trade calculator built specifically for the Viperfish Cartel in Albion Online.",
    screenshots: [
      "https://via.placeholder.com/300x600/303134/ffffff?text=Dashboard",
      "https://via.placeholder.com/300x600/303134/ffffff?text=Calculator"
    ]
  }
];

// Initialize detail page
window.onload = () => {
  // 1. Extract ?id= parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const appId = urlParams.get('id');

  // Back button event
  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  if (!appId) {
    alert("No App ID specified!");
    window.location.href = 'index.html';
    return;
  }

  // 2. Fetch app record matching the ID
  const app = extendedDatabase.find(item => item.id === appId);

  if (app) {
    // 3. Inject data into HTML elements
    document.title = `${app.title} - Aku Store`;
    document.getElementById('detailIcon').src = app.icon;
    document.getElementById('detailTitle').innerText = app.title;
    document.getElementById('detailDeveloper').innerText = app.developer;
    document.getElementById('detailRating').innerText = app.rating;
    document.getElementById('detailSize').innerText = app.size;
    document.getElementById('detailDescription').innerText = app.description;
    
    // Set direct download URL
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = app.apkUrl;
    downloadBtn.setAttribute('download', '');

    // Render screenshots
    const screenshotsContainer = document.getElementById('screenshotsContainer');
    screenshotsContainer.innerHTML = '';
    app.screenshots.forEach(src => {
      screenshotsContainer.innerHTML += `<img src="${src}" class="screenshot-img" alt="Screenshot">`;
    });
  } else {
    document.getElementById('detailTitle').innerText = "App Not Found";
    document.getElementById('detailDescription').innerText = "The requested application does not exist or has been removed.";
  }
}; 
