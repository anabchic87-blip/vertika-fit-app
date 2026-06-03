function workoutKey() {
  const slug = document.body.dataset.workout || "rutina";
  const today = new Date().toISOString().slice(0, 10);
  return "vertikaWorkoutPage_" + slug + "_" + today;
}
export const firebaseConfig = {
  apiKey: "AIzaSyA8qlF6AfXAlLCLvrooG8IY0fBSHWCpfEU",
  authDomain: "vertika-fit-app-c361a.firebaseapp.com",
  projectId: "vertika-fit-app-c361a",
  storageBucket: "vertika-fit-app-c361a.firebasestorage.app",
  messagingSenderId: "746569602423",
  appId: "1:746569602423:web:b7713b5746cee4fdd63d72"
};

function loadChecks() {
  const saved = JSON.parse(localStorage.getItem(workoutKey()) || "{}");
  document.querySelectorAll(".exercise-check").forEach((check) => {
    const id = check.dataset.id;
    check.checked = Boolean(saved[id]);
    check.addEventListener("change", saveChecks);
  });
  updateProgress();
}

function saveChecks() {
  const saved = {};
  document.querySelectorAll(".exercise-check").forEach((check) => {
    saved[check.dataset.id] = check.checked;
  });
  localStorage.setItem(workoutKey(), JSON.stringify(saved));
  updateProgress();
}

function updateProgress() {
  const checks = Array.from(document.querySelectorAll(".exercise-check"));
  const done = checks.filter(c => c.checked).length;
  const box = document.getElementById("progressText");
  if (box) box.textContent = done + "/" + checks.length + " ejercicios completados";
}

function markWorkoutDone() {
  const slug = document.body.dataset.workout || "rutina";
  const month = new Date().toISOString().slice(0, 7);
  const today = new Date().toISOString().slice(0, 10);
  const key = "vertikaEntrenos_" + month;
  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  const record = today + "_" + slug;
  if (!saved.includes(record)) {
    saved.push(record);
    localStorage.setItem(key, JSON.stringify(saved));
  }
  alert("Entrenamiento guardado en VÉRTIKA FIT ✅");
}

function resetChecks() {
  localStorage.removeItem(workoutKey());
  document.querySelectorAll(".exercise-check").forEach((check) => check.checked = false);
  updateProgress();
}

document.addEventListener("DOMContentLoaded", loadChecks);
