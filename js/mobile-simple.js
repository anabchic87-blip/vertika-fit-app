
/* ===== VÉRTIKA FIT 18 · MOBILE SIMPLE NAV ===== */

const vertikaMobilePages = [
  { id: "inicio", label: "Inicio", icon: "🏠" },
  { id: "perfil", label: "Perfil", icon: "👤" },
  { id: "menuSemanal", label: "Menú", icon: "🥗" },
  { id: "progreso", label: "Progreso", icon: "📈" },
  { id: "entrenamientos", label: "Entrenos", icon: "🏋️" },
  { id: "vertikaBackupPanel", label: "Copia", icon: "💾" }
];

let vertikaCurrentMobileIndex = 0;

function vertikaPageExists(id) {
  return Boolean(document.getElementById(id));
}

function vertikaVisiblePages() {
  return vertikaMobilePages.filter(p => vertikaPageExists(p.id));
}

function vertikaGoMobile(index) {
  const pages = vertikaVisiblePages();
  if (!pages.length) return;

  if (index < 0) index = pages.length - 1;
  if (index >= pages.length) index = 0;

  vertikaCurrentMobileIndex = index;
  const page = pages[index];

  if (typeof mostrarSeccion === "function") {
    mostrarSeccion(page.id, null);
  } else {
    document.querySelectorAll(".page").forEach(el => el.classList.add("hidden"));
    document.getElementById(page.id)?.classList.remove("hidden");
  }

  document.querySelectorAll(".mobile-tab").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.mobile-tab[data-page="${page.id}"]`)?.classList.add("active");

  const title = document.getElementById("mobileSectionTitle");
  if (title) title.textContent = `${page.icon} ${page.label}`;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function vertikaNextMobile() {
  vertikaGoMobile(vertikaCurrentMobileIndex + 1);
}

function vertikaPrevMobile() {
  vertikaGoMobile(vertikaCurrentMobileIndex - 1);
}

function vertikaBuildMobileNav() {
  if (document.getElementById("vertikaMobileNav")) return;

  const pages = vertikaVisiblePages();
  if (!pages.length) return;

  const top = document.createElement("div");
  top.id = "vertikaMobileTop";
  top.innerHTML = `
    <button type="button" onclick="vertikaPrevMobile()">‹</button>
    <strong id="mobileSectionTitle">🏠 Inicio</strong>
    <button type="button" onclick="vertikaNextMobile()">›</button>
  `;
  document.body.appendChild(top);

  const left = document.createElement("button");
  left.id = "vertikaSidePrev";
  left.className = "vertika-side-btn";
  left.type = "button";
  left.textContent = "‹";
  left.onclick = vertikaPrevMobile;
  document.body.appendChild(left);

  const right = document.createElement("button");
  right.id = "vertikaSideNext";
  right.className = "vertika-side-btn";
  right.type = "button";
  right.textContent = "›";
  right.onclick = vertikaNextMobile;
  document.body.appendChild(right);

  const nav = document.createElement("nav");
  nav.id = "vertikaMobileNav";
  nav.innerHTML = pages.map((p, i) => `
    <button type="button" class="mobile-tab ${i === 0 ? "active" : ""}" data-page="${p.id}" onclick="vertikaGoMobile(${i})">
      <span>${p.icon}</span>
      <small>${p.label}</small>
    </button>
  `).join("");
  document.body.appendChild(nav);

  // Hide old sidebar/menu visually on mobile only via CSS.
  const firstVisible = pages.findIndex(p => !document.getElementById(p.id)?.classList.contains("hidden"));
  vertikaGoMobile(firstVisible >= 0 ? firstVisible : 0);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(vertikaBuildMobileNav, 500);
});
