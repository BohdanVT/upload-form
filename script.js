const SCRIPT_URL = 'https://odd-waterfall-2669.bvo-44f.workers.dev';

function goToStep2() {
  const fullName = document.getElementById('fullName').value.trim();
  if (!fullName) {
    alert('Please enter your full name');
    return;
  }

  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');

  step1.style.opacity = 0;
  setTimeout(() => {
    step1.style.display = 'none';
    step2.style.display = 'flex';
    step2.style.opacity = 0;
    setTimeout(() => (step2.style.opacity = 1), 50);
  }, 300);
}

document.getElementById('fileInput').addEventListener('change', () => {
  const input = document.getElementById('fileInput');
  const label = document.getElementById('fileLabel');
  const files = input.files;

  if (files.length === 0) {
    label.value = 'No files selected';
  } else if (files.length === 1) {
    label.value = files[0].name;
  } else {
    label.value = `${files.length} files selected`;
  }
});

async function upload() {
  const fullName = document.getElementById('fullName').value.trim();
  const files = document.getElementById('fileInput').files;
  const status = document.getElementById('status');
  const loader = document.getElementById('loader');

  if (!files.length) {
    alert('Please select at least one file');
    return;
  }

  document.getElementById('step2').style.opacity = 0;
  setTimeout(() => {
    document.getElementById('step2').style.display = 'none';
    loader.style.display = 'block';
  }, 300);

  const uploaded = [];

  for (let file of files) {
    const base64Data = await readFileAsBase64(file);
    uploaded.push({
      name: file.name,
      data: base64Data.split(',')[1]
    });
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, files: uploaded })
    });

    const text = await response.text();
    loader.style.display = 'none';

    if (text === 'OK') {
      status.innerHTML = `<div style="color: #28a745; font-size: 24px; font-weight: bold; animation: fadeIn 0.5s ease;">✅ Done!</div>`;
    } else {
      status.innerHTML = `<div style="color: red; font-size: 18px; font-weight: bold;">❌ Fail: ${text}</div>`;
    }
  } catch (error) {
    loader.style.display = 'none';
    status.innerHTML = `<div style="color: red; font-size: 18px; font-weight: bold;">⚠️ Error: ${error.message}</div>`;
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = e => reject(e);
    reader.readAsDataURL(file);
  });
}
