const SCRIPT_URL = 'https://odd-waterfall-2669.bvo-44f.workers.dev';

function goToStep2() {
  const fullName = document.getElementById('fullName').value.trim();
  if (!fullName) {
    alert('Будь ласка, введіть ПІБ');
    return;
  }

  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');

  step1.style.opacity = 0;
  setTimeout(() => {
    step1.style.display = 'none';
    step2.style.display = 'flex';
    step2.style.opacity = 0;
    setTimeout(() => step2.style.opacity = 1, 50);
  }, 300);
}

function displaySelectedFiles() {
  const input = document.getElementById('fileInput');
  const fileNamesField = document.getElementById('fileNames');

  if (input.files.length === 0) {
    fileNamesField.value = 'Файли не обрано';
  } else {
    const names = Array.from(input.files).map(f => f.name).join(', ');
    fileNamesField.value = names.length > 50 ? names.slice(0, 50) + '...' : names;
  }
}

async function upload() {
  const fullName = document.getElementById('fullName').value.trim();
  const files = document.getElementById('fileInput').files;
  const status = document.getElementById('status');
  const loader = document.getElementById('loader');

  if (!files.length) {
    alert('Будь ласка, виберіть хоча б один файл');
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