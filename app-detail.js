// Navigation Back
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Navigation Profile
document.getElementById('userProfileBtn').addEventListener('click', () => {
  window.location.href = 'auth.html';
});

// Fallback Default Apps Database
const defaultDatabase = [
  {
    id: "com.aku.vitsdemo",
    title: "VITS Demo Application",
    developer: "M. A. Akmal Ahamed",
    rating: 4.8,
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
    category: "apps",
    size: "12 MB",
    description: "Official VITS demonstration platform built for high-performance audio synthesis and speech models.",
    apkUrl: "#",
    screenshots: [
      "https://via.placeholder.com/300x533/1e1e24/ffffff?text=VITS+Interface",
      "https://via.placeholder.com/300x533/1e1e24/ffffff?text=Synthesis+Settings"
    ]
  },
  {
    id: "com.aku.sscknews",
    title: "SSCK News Portal",
    developer: "St. Sylvester's College",
    rating: 4.9,
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
    category: "apps",
    size: "8 MB",
    description: "Keep updated with student announcements, timetables, academic results, and event notifications.",
    apkUrl: "#",
    screenshots: [
      "https://via.placeholder.com/300x533/1e1e24/ffffff?text=News+Feed",
      "https://via.placeholder.com/300x533/1e1e24/ffffff?text=Timetable"
    ]
  },
  {
    id: "com.viperfish.albion",
    title: "Viperfish Cartel Hub",
    developer: "A3 BROTHERS",
    rating: 4.5,
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg",
    category: "games",
    size: "45 MB",
    description: "Official guild management app for Viperfish Cartel in Albion Online. View player rosters and event builds.",
    apkUrl: "#",
    screenshots: [
      "https://via.placeholder.com/300x533/1e1e24/ffffff?text=Guild+Roster",
      "https://via.placeholder.com/300x533/1e1e24/ffffff?text=Build+Planner"
    ]
  }
];

let currentApp = null;

// Get URL Parameter
function getAppIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Fetch Full App Object (Developer LocalStorage uploads + Default DB)
function getAppDetails(appId) {
  const developerApps = JSON.parse(localStorage.getItem('aku_uploaded_apps') || '[]');
  const allApps = [...defaultDatabase, ...developerApps];
  return allApps.find(app => app.id === appId);
}

// Load App Detail View
function loadAppDetails() {
  const appId = getAppIdFromURL();
  if (!appId) {
    window.location.href = 'index.html';
    return;
  }

  currentApp = getAppDetails(appId);

  if (!currentApp) {
    document.getElementById('appDetailContent').innerHTML = `<p style="text-align:center; margin-top:3rem;">App not found.</p>`;
    return;
  }

  // Populate UI
  document.getElementById('detailAppIcon').src = currentApp.icon || 'https://via.placeholder.com/100';
  document.getElementById('detailAppTitle').innerText = currentApp.title;
  document.getElementById('detailAppDeveloper').innerText = currentApp.developer;
  document.getElementById('detailRating').innerText = currentApp.rating || '5.0';
  document.getElementById('detailSize').innerText = currentApp.size || '10 MB';
  document.getElementById('detailCategory').innerText = (currentApp.category || 'Apps').toUpperCase();
  document.getElementById('detailDescription').innerText = currentApp.description || 'No description provided for this application.';

  // APK Download Link
  const downloadBtn = document.getElementById('downloadBtn');
  if (currentApp.apkUrl && currentApp.apkUrl !== '#') {
    downloadBtn.href = currentApp.apkUrl;
    downloadBtn.setAttribute('download', `${currentApp.title}.apk`);
  } else {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Simulation Mode: APK file direct link not configured by developer.");
    });
  }

  // Render Screenshots
  const screenshotsContainer = document.getElementById('screenshotsContainer');
  screenshotsContainer.innerHTML = '';
  const shots = currentApp.screenshots && currentApp.screenshots.length > 0 
    ? currentApp.screenshots 
    : ['https://via.placeholder.com/300x533/1e1e24/ffffff?text=Preview+1', 'https://via.placeholder.com/300x533/1e1e24/ffffff?text=Preview+2'];

  shots.forEach(imgUrl => {
    screenshotsContainer.innerHTML += `<img src="${imgUrl}" alt="App Screenshot" class="screenshot-img">`;
  });

  renderReviews();
}

// Render User Reviews
function renderReviews() {
  const reviewsContainer = document.getElementById('reviewsList');
  const allReviews = JSON.parse(localStorage.getItem(`aku_reviews_${currentApp.id}`) || '[]');

  if (allReviews.length === 0) {
    reviewsContainer.innerHTML = `<p style="color: var(--text-secondary); font-size:0.85rem;">No reviews yet. Be the first to leave a review!</p>`;
    return;
  }

  reviewsContainer.innerHTML = '';
  allReviews.forEach(rev => {
    reviewsContainer.innerHTML += `
      <div class="upload-form" style="padding: 1rem; gap: 0.4rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="font-size: 0.9rem; color: var(--text-primary);">${rev.username}</strong>
          <span style="color: #ffb703; font-size: 0.85rem;">${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4;">${rev.comment}</p>
        <span style="color: var(--border-color); font-size: 0.7rem;">${rev.date}</span>
      </div>
    `;
  });
}

// Handle Review Submission
document.getElementById('submitReviewBtn').addEventListener('click', () => {
  const session = localStorage.getItem('aku_store_session');
  if (!session) {
    alert("Please sign in to leave a review.");
    window.location.href = 'auth.html';
    return;
  }

  const user = JSON.parse(session);
  const rating = parseInt(document.getElementById('reviewRatingSelect').value, 10);
  const comment = document.getElementById('reviewCommentInput').value.trim();

  if (!comment) {
    alert("Please enter a review comment.");
    return;
  }

  const newReview = {
    username: user.username || user.gamertag || "Anonymous",
    rating: rating,
    comment: comment,
    date: new Date().toLocaleDateString()
  };

  const existingReviews = JSON.parse(localStorage.getItem(`aku_reviews_${currentApp.id}`) || '[]');
  existingReviews.unshift(newReview);
  localStorage.setItem(`aku_reviews_${currentApp.id}`, JSON.stringify(existingReviews));

  document.getElementById('reviewCommentInput').value = '';
  renderReviews();
});

// Initialize
window.onload = loadAppDetails; 
