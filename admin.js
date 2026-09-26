document.getElementById('backToStoreBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Enforce Admin/Staff Access Control
function checkAdminAccess() {
  const session = localStorage.getItem('aku_store_session');
  if (!session) {
    alert("Access Denied: Please sign in.");
    window.location.href = 'auth.html';
    return false;
  }

  const user = JSON.parse(session);
  if (user.role !== 'admin' && user.role !== 'staff') {
    alert("Access Denied: Admin or Staff permissions required.");
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Render Developer Applications
function renderDeveloperRequests() {
  const container = document.getElementById('requestsListContainer');
  const devRequests = JSON.parse(localStorage.getItem('aku_dev_requests') || '[]');

  if (devRequests.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary);">No developer applications submitted yet.</p>`;
    return;
  }

  container.innerHTML = '';
  devRequests.forEach(req => {
    container.innerHTML += `
      <div class="upload-form" style="flex-direction: row; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="font-size: 1.1rem;">${req.businessName}</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">User: ${req.username} (${req.email})</p>
          <p style="color: var(--accent-color); font-size: 0.8rem; margin-top: 0.2rem;">Status: ${req.status.toUpperCase()}</p>
        </div>
        ${req.status === 'pending' ? `
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="approveDeveloper('${req.requestId}', '${req.userId}')" class="install-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem; cursor: pointer;">Approve</button>
            <button onclick="rejectDeveloper('${req.requestId}')" class="install-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem; background-color: rgba(255,82,82,0.2); border: 1px solid #ff5252; color: #ff8a80; cursor: pointer;">Reject</button>
          </div>
        ` : ''}
      </div>
    `;
  });
}

// Approve Developer Request
window.approveDeveloper = (reqId, userId) => {
  let devRequests = JSON.parse(localStorage.getItem('aku_dev_requests') || '[]');
  let usersList = JSON.parse(localStorage.getItem('aku_store_users') || '[]');

  // Update request status
  devRequests = devRequests.map(r => r.requestId === reqId ? { ...r, status: 'approved' } : r);
  localStorage.setItem('aku_dev_requests', JSON.stringify(devRequests));

  // Promote user role to developer
  usersList = usersList.map(u => u.id === userId ? { ...u, role: 'developer' } : u);
  localStorage.setItem('aku_store_users', JSON.stringify(usersList));

  alert("Developer approved!");
  renderDeveloperRequests();
  renderUsersList();
};

// Reject Developer Request
window.rejectDeveloper = (reqId) => {
  let devRequests = JSON.parse(localStorage.getItem('aku_dev_requests') || '[]');
  devRequests = devRequests.map(r => r.requestId === reqId ? { ...r, status: 'rejected' } : r);
  localStorage.setItem('aku_dev_requests', JSON.stringify(devRequests));

  alert("Developer request rejected.");
  renderDeveloperRequests();
};

// Render System Users
function renderUsersList() {
  const container = document.getElementById('usersListContainer');
  const usersList = JSON.parse(localStorage.getItem('aku_store_users') || '[]');

  if (usersList.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary);">No registered users.</p>`;
    return;
  }

  container.innerHTML = '';
  usersList.forEach(user => {
    container.innerHTML += `
      <div class="upload-form" style="flex-direction: row; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="font-size: 1rem;">${user.username} (${user.gamertag || 'No Gamertag'})</h3>
          <p style="color: var(--text-secondary); font-size: 0.8rem;">${user.email} • Role: <strong style="color: var(--accent-color);">${user.role}</strong></p>
        </div>
      </div>
    `;
  });
}

// Initialize Admin Portal
window.onload = () => {
  if (checkAdminAccess()) {
    renderDeveloperRequests();
    renderUsersList();
  }
}; 
