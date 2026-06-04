
/* ===== VÉRTIKA FIT 16 · LOGIN LOCAL + BACKUP ===== */

const VERTIKA_LOCAL_USER_KEY = "vertikaLocalUser";
const VERTIKA_SESSION_KEY = "vertikaSessionActive";

function vertikaSetAuthMessage(text, type = "") {
  const box = document.getElementById("authMessage");
  if (!box) return;
  box.textContent = text;
  box.className = "auth-message " + type;
}

function vertikaHashSimple(text) {
  // No es seguridad bancaria: solo evita guardar la contraseña en texto plano.
  let hash = 0;
  const value = String(text || "");
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function vertikaGetLocalUser() {
  try {
    return JSON.parse(localStorage.getItem(VERTIKA_LOCAL_USER_KEY) || "null");
  } catch {
    return null;
  }
}

function vertikaSetLayout(isLogged) {
  const authScreen = document.getElementById("authScreen");
  const layout = document.querySelector(".layout");
  const chip = document.getElementById("firebaseUserChip");

  if (authScreen) authScreen.style.display = isLogged ? "none" : "flex";
  if (layout) layout.style.display = isLogged ? "flex" : "none";
  if (chip) {
    const user = vertikaGetLocalUser();
    chip.textContent = isLogged && user?.email ? user.email : "Sin sesión";
  }
}

window.showAuthPanel = function(which) {
  document.getElementById("loginPanel")?.classList.toggle("active", which === "login");
  document.getElementById("registerPanel")?.classList.toggle("active", which === "register");
  document.getElementById("tabLogin")?.classList.toggle("active", which === "login");
  document.getElementById("tabRegister")?.classList.toggle("active", which === "register");
  vertikaSetAuthMessage("");
};

window.registerVertika = function() {
  const email = document.getElementById("registerEmail")?.value.trim();
  const password = document.getElementById("registerPassword")?.value.trim();

  if (!email || !password) {
    vertikaSetAuthMessage("Rellena correo y contraseña.", "bad");
    return;
  }

  if (password.length < 6) {
    vertikaSetAuthMessage("La contraseña debe tener al menos 6 caracteres.", "bad");
    return;
  }

  const user = {
    email,
    passwordHash: vertikaHashSimple(password),
    createdAt: new Date().toISOString(),
    sistema: "local"
  };

  localStorage.setItem(VERTIKA_LOCAL_USER_KEY, JSON.stringify(user));
  localStorage.setItem(VERTIKA_SESSION_KEY, "true");

  vertikaSetAuthMessage("Cuenta local creada correctamente.", "ok");
  setTimeout(() => vertikaSetLayout(true), 400);
};

window.loginVertika = function() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();
  const user = vertikaGetLocalUser();

  if (!email || !password) {
    vertikaSetAuthMessage("Rellena correo y contraseña.", "bad");
    return;
  }

  if (!user) {
    vertikaSetAuthMessage("Primero crea tu cuenta local.", "bad");
    return;
  }

  if (user.email !== email || user.passwordHash !== vertikaHashSimple(password)) {
    vertikaSetAuthMessage("Correo o contraseña incorrectos.", "bad");
    return;
  }

  localStorage.setItem(VERTIKA_SESSION_KEY, "true");
  vertikaSetAuthMessage("Sesión iniciada correctamente.", "ok");
  setTimeout(() => vertikaSetLayout(true), 300);
};

window.logoutVertika = function() {
  localStorage.removeItem(VERTIKA_SESSION_KEY);
  vertikaSetLayout(false);
};

function vertikaExportarDatos() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith("vertika"));
  const data = {};
  keys.forEach(k => data[k] = localStorage.getItem(k));

  const backup = {
    app: "VERTIKA FIT",
    version: "16-local-stable",
    exportedAt: new Date().toISOString(),
    data
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `backup-vertika-fit-${fecha}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function vertikaImportarDatos(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const backup = JSON.parse(e.target.result);
      if (!backup.data || typeof backup.data !== "object") {
        alert("El archivo no parece una copia válida de VÉRTIKA.");
        return;
      }

      Object.entries(backup.data).forEach(([key, value]) => {
        if (key.startsWith("vertika")) localStorage.setItem(key, value);
      });

      alert("Copia importada correctamente. La app se recargará.");
      location.reload();
    } catch (error) {
      alert("No se pudo importar la copia de seguridad.");
      console.error(error);
    }
  };
  reader.readAsText(file);
}

function vertikaBorrarDatosLocales() {
  const confirmar = confirm("¿Seguro que quieres borrar todos los datos locales de VÉRTIKA en este dispositivo?");
  if (!confirmar) return;
  Object.keys(localStorage).filter(k => k.startsWith("vertika")).forEach(k => localStorage.removeItem(k));
  alert("Datos borrados. La app se recargará.");
  location.reload();
}

function vertikaCrearPanelBackup() {
  if (document.getElementById("vertikaBackupPanel")) return;

  const section = document.createElement("section");
  section.id = "vertikaBackupPanel";
  section.className = "page hidden";
  section.innerHTML = `
    <h2>Copia de seguridad</h2>
    <p class="subtitle">Guarda o recupera tus datos de VÉRTIKA FIT en este dispositivo.</p>

    <div class="card-grid">
      <article class="card">
        <span>💾</span>
        <h3>Exportar datos</h3>
        <p>Descarga un archivo JSON con tu perfil, progreso, entrenamientos, menús y hábitos.</p>
        <button onclick="vertikaExportarDatos()">Exportar copia</button>
      </article>

      <article class="card">
        <span>📂</span>
        <h3>Importar datos</h3>
        <p>Restaura una copia de seguridad hecha anteriormente.</p>
        <input type="file" id="vertikaImportFile" accept="application/json">
        <button onclick="vertikaImportarDatos(document.getElementById('vertikaImportFile').files[0])">Importar copia</button>
      </article>

      <article class="card danger-card">
        <span>🧹</span>
        <h3>Borrar datos locales</h3>
        <p>Elimina todos los datos guardados en este navegador.</p>
        <button onclick="vertikaBorrarDatosLocales()">Borrar datos</button>
      </article>
    </div>

    <div class="notice">
      Tus datos se guardan solo en este navegador. Para pasar del PC al móvil, exporta la copia e impórtala en el otro dispositivo.
    </div>
  `;

  const main = document.querySelector("main");
  if (main) main.appendChild(section);

  const menu = document.querySelector(".menu");
  if (menu && !document.getElementById("btnBackupVertika")) {
    const btn = document.createElement("button");
    btn.id = "btnBackupVertika";
    btn.textContent = "Copia seguridad";
    btn.onclick = function() { mostrarSeccion("vertikaBackupPanel", btn); };
    menu.appendChild(btn);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  vertikaCrearPanelBackup();

  const active = localStorage.getItem(VERTIKA_SESSION_KEY) === "true";
  const user = vertikaGetLocalUser();

  if (active && user) {
    vertikaSetLayout(true);
  } else {
    vertikaSetLayout(false);
  }

  console.log("VÉRTIKA FIT 16 conectado en modo local, sin Firebase.");
});
