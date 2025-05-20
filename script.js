const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyuT61yfyJEfN04Pz6_v2f0_yArhhVo-X9KUgm7t01J2qqffUQsYmJzgU08AjGstfxV/exec'; 

function goToStep2() {
  const fullName = document.getElementById('fullName').value.trim();
  if (!fullName) {
    alert('Будь ласка, введіть ПІБ');
    return;
  }
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'flex';
}

async function upload() {
  const fullName = document.getElementById('fullName').value.trim();
  const files = document.getElementById('fileInput').files;
  const status = document.getElementById('status');

  if (!files.length) {
    alert('Будь ласка, виберіть хоча б один файл');
    return;
  }

  document.getElementById('step2').style.display = 'none';
  document.getElementById('loader').style.display = 'block';

  let uploaded = [];
  let readCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
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
      body: JSON.stringify({ fullName: fullName, files: uploaded })
    });

    const text = await response.text();

    document.getElementById('loader').style.display = 'none';

    if (text === 'OK') {
      status.innerHTML = '<div style="color: #28a745; font-size: 25px; font-weight: bold; animation: fadeIn 1s ease-in-out;">✅ Done!</div>';
    } else {
      status.innerHTML = `<div style="color: red; font-size: 18px; font-weight: bold;">❌ Помилка при завантаженні: ${text}</div>`;
    }
  } catch (error) {
    document.getElementById('loader').style.display = 'none';
    status.innerHTML = `<div style="color: red; font-size: 18px; font-weight: bold;">⚠️ Помилка: ${error.message}</div>`;
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
