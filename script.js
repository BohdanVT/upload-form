const SCRIPT_URL = 'https://odd-waterfall-2669.bvo-44f.workers.dev';

function goToStep2() {
  const fullName = document.getElementById('fullName').value.trim();
  if (!fullName) {
    alert('Будь ласка, введіть ПІБ');
    return;
  }
  toggleStep('step1', 'step2');
}

function toggleStep(hideId, showId) {
  const hideEl = document.getElementById(hideId);
  const showEl = document.getElementById(showId);

  hideEl.classList.remove('active');
  setTimeout(() => {
    hideEl.style.display = 'none';
    if (showEl) {
      showEl.style.display = 'flex';
      setTimeout(() => showEl.classList.add('active'), 20);
    }
  }, 400);
}

const fileInput = document.getElementById('fileInput');
const fileCount = document.getElementById('fileCount');
const chooseFilesBtn = document.getElementById('chooseFilesBtn');

chooseFilesBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  const n = fileInput.files.length;
  if (n === 0) fileCount.value = 'Файли не обрано';
  else if (n === 1) fileCount.value = fileInput.files[0].name;
  else fileCount.value = `${n} файлів обрано`;
});

async function upload() {
  const fullName = document.getElementById('fullName').value.trim();
  const files = fileInput.files;
  const status = document.getElementById('status');
  const loader = document.getElementById('loader');

  if (!files.length) {
    alert('Будь ласка, виберіть хоча б один файл');
    return;
  }

  toggleStep('step2', '');
  loader.style.display = 'block';

  const uploaded = [];
  for (let file of files) {
    const base64Data = await readFileAsBase64(file);
    uploaded.push({ name: file.name, data: base64Data.split(',')[1] });
  }

  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, files: uploaded })
    });

    const text = await res.text();
    loader.style.display = 'none';

    if (text === 'OK') {
      status.innerHTML = `<div class="success">✅ Завантажено успішно!</div>`;
    } else {
      status.innerHTML = `<div class="error">❌ Помилка: ${text}</div>`;
    }
  } catch (e) {
    loader.style.display = 'none';
    status.innerHTML = `<div class="error">⚠️ Помилка: ${e.message}</div>`;
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