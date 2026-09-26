document.getElementById('backToStoreBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Helper: Convert File object to Base64 string for GitHub API
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    // Remove data URL prefix (e.g., "data:application/octet-stream;base64,")
    const base64String = reader.result.split(',')[1];
    resolve(base64String);
  };
  reader.onerror = error => reject(error);
});

// Helper: Image dimension validator
const validateImageDimensions = (file, targetWidth, targetHeight) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      // Allow +/- 10px margin of error
      const validWidth = Math.abs(img.width - targetWidth) <= 10;
      const validHeight = Math.abs(img.height - targetHeight) <= 10;
      resolve({ valid: validWidth && validHeight, w: img.width, h: img.height });
    };
  });
};

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const statusBox = document.getElementById('statusMessage');
  const submitBtn = document.getElementById('submitBtn');
  
  statusBox.className = 'status-box';
  statusBox.style.display = 'none';

  // 1. Validate APK File Extension
  const apkInput = document.getElementById('apkFile').files[0];
  if (!apkInput.name.toLowerCase().endsWith('.apk')) {
    document.getElementById('apkFileError').innerText = "Selected file must have a .apk extension!";
    return;
  } else {
    document.getElementById('apkFileError').innerText = "";
  }

  // 2. Validate Icon Dimensions (512x512 target)
  const iconInput = document.getElementById('appIcon').files[0];
  const iconValidation = await validateImageDimensions(iconInput, 512, 512);
  if (!iconValidation.valid) {
    document.getElementById('iconFileError').innerText = `Icon dimensions must be 512x512px. Uploaded: ${iconValidation.w}x${iconValidation.h}px`;
    return;
  } else {
    document.getElementById('iconFileError').innerText = "";
  }

  // 3. Begin Upload Process
  submitBtn.disabled = true;
  submitBtn.innerText = "Encoding & Uploading to GitHub...";

  try {
    const appPackage = document.getElementById('appPackage').value.trim();
    const repo = document.getElementById('ghRepo').value.trim();
    const token = document.getElementById('ghToken').value.trim();

    // Prepare Base64 contents
    const apkBase64 = await fileToBase64(apkInput);
    const iconBase64 = await fileToBase64(iconInput);

    const apkPath = `apks/${appPackage}/${apkInput.name}`;
    const iconPath = `icons/${appPackage}.png`;

    // Function to push single file to GitHub REST API
    const pushToGitHub = async (path, base64Content, commitMessage) => {
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to commit file to GitHub repository.');
      }
      return await response.json();
    };

    // Upload Icon first
    await pushToGitHub(iconPath, iconBase64, `Add icon for ${appPackage}`);
    
    // Upload APK second
    const apkUploadResult = await pushToGitHub(apkPath, apkBase64, `Add APK binary for ${appPackage}`);

    // Generate Raw direct download URL
    const rawApkUrl = apkUploadResult.content.download_url;

    statusBox.className = 'status-box success';
    statusBox.innerHTML = `
      <strong>Upload Successful!</strong><br>
      APK file committed to repository.<br>
      <small style="word-break: break-all;">Direct Link: ${rawApkUrl}</small>
    `;
    
  } catch (err) {
    statusBox.className = 'status-box error';
    statusBox.innerHTML = `<strong>Upload Failed:</strong> ${err.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Validate & Upload to GitHub";
  }
}); 
