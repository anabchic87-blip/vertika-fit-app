
const menu = {
  lunes: ["Yogur griego 0% 200 g + avena 40 g", "Pollo 140 g + arroz 150 g + verduras", "Whey 30 g + plátano", "Merluza 160 g + patata 180 g"],
  martes: ["Tortilla 2 huevos + pan integral", "Pavo 150 g + boniato 200 g", "Queso fresco batido + manzana", "Salmón 130 g + ensalada"],
  miercoles: ["Avena 45 g + proteína 25 g", "Ternera magra 130 g + patata", "Yogur + frutos secos 15 g", "Tortilla + claras + ensalada"],
  jueves: ["Yogur + kiwi + avena", "Pollo 150 g + pasta 150 g", "Whey 30 g + fruta", "Pescado blanco + crema verduras"],
  viernes: ["Tostada integral + aguacate + huevo", "Pavo 150 g + arroz 150 g", "Queso fresco batido + frutos rojos", "Pollo + boniato"],
  sabado: ["Avena + yogur + fruta", "Flexible: proteína + patata/arroz", "Proteína o yogur", "Cena ligera"],
  domingo: ["Tostada + huevo + fruta", "Comida familiar controlada", "Yogur o fruta", "Pescado o tortilla + verduras"]
};

const compra = ["Pollo/pavo 1,2 kg", "Pescado blanco 700 g", "Salmón 400 g", "Huevos 12", "Yogur griego 0% 7 uds", "Avena 500 g", "Arroz 1 paquete", "Patata/boniato 2 kg", "Verduras 3 kg", "Fruta 2,5 kg", "Aceite de oliva", "Frutos secos"];

function entrar(){
  const nombre = document.getElementById("loginName").value || "Ana Belén";
  localStorage.setItem("vertikaNombre", nombre);
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("saludo").textContent = `Hola, ${nombre} ☀️`;
  init();
}

function salir(){
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.remove("active"));
  const index = ["dashboard","progress","calendar","train","menu","shopping","content","profile"].indexOf(id);
  if(index >= 0) document.querySelectorAll(".bottom-nav button")[index].classList.add("active");
  if(id === "content" && typeof cargarContenidoPro === "function") cargarContenidoPro();
  window.scrollTo({top:0,behavior:"smooth"});
}

function getProgreso(){
  return JSON.parse(localStorage.getItem("vertikaProgreso21") || "[]");
}

function setProgreso(data){
  localStorage.setItem("vertikaProgreso21", JSON.stringify(data));
}

function guardarProgreso(){
  const peso = Number(document.getElementById("pesoInput").value);
  const cintura = Number(document.getElementById("cinturaInput").value);
  if(!peso || !cintura){ alert("Añade peso y cintura."); return; }
  const data = getProgreso();
  data.push({fecha:new Date().toLocaleDateString("es-ES"), peso, cintura});
  setProgreso(data);
  document.getElementById("pesoInput").value = "";
  document.getElementById("cinturaInput").value = "";
  pintarProgreso();
}

function pintarProgreso(){
  const data = getProgreso();
  const ultimo = data.length ? data[data.length-1] : {peso:80,cintura:97};
  document.getElementById("kpiPeso").textContent = `${ultimo.peso} kg`;
  document.getElementById("kpiCintura").textContent = `${ultimo.cintura} cm`;
  document.getElementById("historial").innerHTML = data.length ? data.slice().reverse().map(x=>`${x.fecha} · ${x.peso} kg · ${x.cintura} cm`).join("<br>") : "Aún no hay registros.";
  drawChart("pesoChart", data.map(x=>x.peso), 80, "kg");
  drawChart("cinturaChart", data.map(x=>x.cintura), 97, "cm");
}

function drawChart(id, values, fallback, unit){
  const canvas = document.getElementById(id);
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0,0,w,h);
  const data = values.length ? values : [fallback];
  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  ctx.strokeStyle = "#ead5ff";
  ctx.lineWidth = 1;
  for(let i=1;i<5;i++){
    const y = h*i/5;
    ctx.beginPath(); ctx.moveTo(30,y); ctx.lineTo(w-20,y); ctx.stroke();
  }
  ctx.strokeStyle = "#5b19a8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x = 40 + (i*(w-70)/Math.max(1,data.length-1));
    const y = h-35 - ((v-min)/(max-min))*(h-70);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  ctx.fillStyle = "#ff6a00";
  data.forEach((v,i)=>{
    const x = 40 + (i*(w-70)/Math.max(1,data.length-1));
    const y = h-35 - ((v-min)/(max-min))*(h-70);
    ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
  });
}

function marcarEntreno(tipo){
  const hoy = new Date().toISOString().slice(0,10);
  const data = JSON.parse(localStorage.getItem("vertikaEntrenos21") || "{}");
  data[hoy] = tipo;
  localStorage.setItem("vertikaEntrenos21", JSON.stringify(data));
  pintarCalendario();
  alert("Entrenamiento guardado ✅");
}

function pintarCalendario(){
  const grid = document.getElementById("calendarGrid");
  const data = JSON.parse(localStorage.getItem("vertikaEntrenos21") || "{}");
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = new Date(year, month+1, 0).getDate();
  grid.innerHTML = "";
  let count = 0;
  for(let d=1; d<=days; d++){
    const iso = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const div = document.createElement("div");
    div.className = "day" + (data[iso] ? " done" : "");
    div.innerHTML = `<strong>${d}</strong><br>${data[iso] ? "✓" : ""}`;
    div.onclick = ()=>{ data[iso] ? delete data[iso] : data[iso]="manual"; localStorage.setItem("vertikaEntrenos21", JSON.stringify(data)); pintarCalendario(); };
    if(data[iso]) count++;
    grid.appendChild(div);
  }
  document.getElementById("kpiEntrenos").textContent = count;
}

function pintarMenu(){
  const dias = document.getElementById("menuDias");
  const cont = document.getElementById("menuContenido");
  dias.innerHTML = "";
  Object.keys(menu).forEach((dia,i)=>{
    const b = document.createElement("button");
    b.textContent = dia.toUpperCase();
    b.onclick = ()=>{
      document.querySelectorAll(".days button").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      cont.innerHTML = `<h3>${dia.toUpperCase()}</h3>` + menu[dia].map(x=>`<p>• ${x}</p>`).join("");
    };
    dias.appendChild(b);
    if(i===0) setTimeout(()=>b.click(),0);
  });
}

function pintarCompra(){
  document.getElementById("shoppingList").innerHTML = compra.map((x,i)=>`<label><input type="checkbox"> ${x}</label>`).join("");
}

function guardarPerfil(){
  localStorage.setItem("vertikaNombre", document.getElementById("perfilNombre").value || "Ana Belén");
  localStorage.setItem("vertikaObjetivo", document.getElementById("perfilObjetivo").value || "72");
  alert("Perfil guardado ✅");
}

function init(){
  pintarProgreso();
  pintarCalendario();
  pintarMenu();
  pintarCompra();
  cargarContenidoPro();
  document.querySelectorAll(".mission").forEach(ch=>{
    const key = "mission_" + new Date().toISOString().slice(0,10) + "_" + ch.dataset.key;
    ch.checked = localStorage.getItem(key)==="true";
    ch.onchange = ()=> localStorage.setItem(key, ch.checked);
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  const nombre = localStorage.getItem("vertikaNombre");
  if(nombre){
    document.getElementById("loginName").value = nombre;
  }
  document.querySelector(".bottom-nav button")?.classList.add("active");
});

async function cargarContenidoPro(){
  await cargarCards("data/workouts.json", "workoutCards", "🏋️");
  await cargarCards("data/diets.json", "dietCards", "🥗");
}
async function cargarCards(url, target, icon){
  const box = document.getElementById(target);
  if(!box) return;

  const fallbackDiets = [
    {
      title: "Dieta ayuno intermitente 4 semanas",
      description: "Plan de pérdida de grasa adaptado a horario 10:00 · 14:30 · 17:00 · 20:00",
      url: "diets/dieta-4-semanas-ayuno-intermitente-vertika.html",
      tag: "Ayuno Intermitente"
    }
  ];

  try{
    const res = await fetch(url + "?v=" + Date.now(), { cache: "no-store" });
    if(!res.ok) throw new Error("No se pudo cargar " + url);
    const items = await res.json();
    pintarCards(box, items, icon);
  }catch(e){
    if(target === "dietCards"){
      pintarCards(box, fallbackDiets, icon);
    } else {
      box.innerHTML = "<p>No se pudo cargar el contenido.</p>";
    }
  }
}

function pintarCards(box, items, icon){
  box.innerHTML = items.map(item => `
    <a class="content-card" href="${item.url}">
      <strong>${icon} ${item.title}</strong>
      <span>${item.description}</span>
      <em>${item.tag || "Abrir"}</em>
    </a>
  `).join("");
}
