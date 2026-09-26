document.getElementById('backToStoreBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

let isSignUpMode = false;

// DOM Elements
const authTitle = document.getElementById('authTitle');
const tabSignIn = document.getElementById('tabSignIn');
const tabSignUp = document.getElementById('tabSignUp');
const registrationFields = document.getElementById('registrationFields');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authForm = document.getElementById('authForm');
const authStatusMessage = document.getElementById('authStatusMessage');

const authCard = document.getElementById('authCard');
const profileCard = document.getElementById('profileCard');

// Switch to Sign In Mode
tabSignIn.addEventListener('click', () => {
  isSignUpMode = false;
  tabSignIn.classList.add('active');
  tabSignUp.classList.remove('active');
  authTitle.innerText = "Sign In";
  authSubmitBtn.innerText = "Sign In";
  registrationFields.style.display = "none";
  authStatusMessage.style.display = "none";
});

// Switch to Register Mode
tabSignUp.addEventListener('click', () => {
  isSignUpMode = true;
  tabSignUp.classList.add('active');
  tabSignIn.classList.remove('active');
  authTitle.innerText = "Create Account";
  authSubmitBtn.innerText = "Register";
  registrationFields.style.display = "block";
  authStatusMessage.style.display = "none";
});

// Get Current User Session
function getCurrentSession() {
  const session = localStorage.getItem('aku_store_session');
  return session ? JSON.parse(session) : null;
}

// Render User State
function renderAuthState() {
  const user = getCurrentSession();

  if (user) {
    authCard.style.display = 'none';
    profileCard.style.display = 'flex';

    document.getElementById('profileUsername').innerText = user.username || 'User';
    document.getElementById('profileRole').innerText = `Role: ${user.role.toUpperCase()}`;
    document.getElementById('profileEmail').innerText = user.email;
    document.getElementById('profileGamertag').innerText = user.gamertag || 'N/A';
    document.getElementById('profileAvatarImg').src = user.avatar || 'https://via.placeholder.com/96';

    // Show Admin Console Button if Admin or Staff
    const adminBtn = document.getElementById('adminConsoleBtn');
    if (user.role === 'admin' || user.role === 'staff') {
      adminBtn.style.display = 'block';
    } else {
      adminBtn.style.display = 'none';
    }
  } else {
    authCard.style.display = 'flex';
    profileCard.style.display = 'none';
  }
}

// Handle Auth Form Submission
authForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();

  if (isSignUpMode) {
    const username = document.getElementById('authUsername').value.trim();
    const gamertag = document.getElementById('authGamertag').value.trim();
    const avatar = document.getElementById('authAvatar').value.trim() || 'https://via.placeholder.com/96';

    if (!username || !gamertag) {
      showStatus("Username and Gamertag are required for registration.", "error");
      return;
    }

    // Default first account to Admin, others to Consumer
    const usersList = JSON.parse(localStorage.getItem('aku_store_users') || '[]');
    const role = usersList.length === 0 ? 'admin' : 'consumer';

    const newUser = {
      id: 'usr_' + Date.now(),
      email,
      password,
      username,
      gamertag,
      avatar,
      role
    };

    usersList.push(newUser);
    localStorage.setItem('aku_store_users', JSON.stringify(usersList));
    localStorage.setItem('aku_store_session', JSON.stringify(newUser));

    showStatus("Account registered successfully!", "success");
    setTimeout(renderAuthState, 1000);

  } else {
    // Sign In logic
    const usersList = JSON.parse(localStorage.getItem('aku_store_users') || '[]');
    const matchedUser = usersList.find(u => u.email === email && u.password === password);

    if (matchedUser) {
      localStorage.setItem('aku_store_session', JSON.stringify(matchedUser));
      showStatus("Login successful!", "success");
      setTimeout(renderAuthState, 800);
    } else {
      showStatus("Invalid email or password.", "error");
    }
  }
});

// Developer Application Request
document.getElementById('devApplyBtn').addEventListener('click', () => {
  const user = getCurrentSession();
  if (!user) return;

  if (user.role === 'developer' || user.role === 'admin') {
    alert("You already have Developer or Admin access!");
    return;
  }

  const devRequests = JSON.parse(localStorage.getItem('aku_dev_requests') || '[]');
  const existing = devRequests.find(r => r.userId === user.id);

  if (existing) {
    alert(`Your application is currently: ${existing.status.toUpperCase()}`);
    return;
  }

  const businessName = prompt("Enter your Developer / Publisher Business Name:");
  if (!businessName) return;

  devRequests.push({
    requestId: 'req_' + Date.now(),
    userId: user.id,
    username: user.username,
    email: user.email,
    businessName: businessName,
    status: 'pending'
  });

  localStorage.setItem('aku_dev_requests', JSON.stringify(devRequests));
  alert("Developer application submitted for Admin approval!");
});

// Admin Button Navigation
document.getElementById('adminConsoleBtn').addEventListener('click', () => {
  window.location.href = 'admin.html';
});

// Logout Listener
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('aku_store_session');
  renderAuthState();
});

// Initialize
window.onload = renderAuthState;

function showStatus(msg, type) {
  authStatusMessage.className = `status-box ${type}`;
  authStatusMessage.innerText = msg;
  authStatusMessage.style.display = 'block';
    } 
