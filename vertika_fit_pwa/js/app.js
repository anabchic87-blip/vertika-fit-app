const menus = {
  lunes: [
    ["Desayuno", "Yogur griego 0% 200 g + avena 40 g + frutos rojos 100 g."],
    ["Comida", "Pollo 140 g + arroz cocido 150 g + verduras 250 g + aceite 10 g."],
    ["Merienda", "Proteína whey 30 g + plátano 1 unidad."],
    ["Cena", "Merluza 160 g + patata cocida 180 g + ensalada grande."]
  ],
  martes: [
    ["Desayuno", "Tortilla de 2 huevos + pan integral 50 g + tomate."],
    ["Comida", "Pavo 150 g + boniato 200 g + verduras 250 g."],
    ["Merienda", "Queso fresco batido 200 g + manzana."],
    ["Cena", "Salmón 130 g + ensalada + arroz cocido 100 g."]
  ],
  miercoles: [
    ["Desayuno", "Avena 45 g + proteína 25 g + leche o bebida vegetal."],
    ["Comida", "Ternera magra 130 g + patata 200 g + verduras."],
    ["Merienda", "Yogur griego 0% + frutos secos 15 g."],
    ["Cena", "Tortilla francesa 2 huevos + claras 120 g + ensalada."]
  ],
  jueves: [
    ["Desayuno", "Yogur griego 0% 200 g + kiwi + avena 35 g."],
    ["Comida", "Pollo 150 g + pasta cocida 150 g + verduras."],
    ["Merienda", "Proteína whey 30 g + fruta."],
    ["Cena", "Pescado blanco 170 g + crema de verduras + patata 150 g."]
  ],
  viernes: [
    ["Desayuno", "Tostada integral 60 g + aguacate 40 g + huevo."],
    ["Comida", "Pavo 150 g + arroz cocido 150 g + ensalada."],
    ["Merienda", "Queso fresco batido 200 g + frutos rojos."],
    ["Cena", "Pollo 130 g + verduras salteadas + boniato 180 g."]
  ],
  sabado: [
    ["Desayuno", "Avena 40 g + yogur griego + fruta."],
    ["Comida", "Opción flexible: carne o pescado 150 g + patata/arroz + ensalada."],
    ["Merienda", "Proteína 30 g o yogur alto en proteína."],
    ["Cena", "Cena ligera: tortilla, ensalada y verdura."]
  ],
  domingo: [
    ["Desayuno", "Tostada integral + huevo + fruta."],
    ["Comida", "Comida familiar controlada: prioriza proteína y verdura."],
    ["Merienda", "Yogur o fruta."],
    ["Cena", "Pescado blanco o tortilla + verduras."]
  ]
};

function mostrarSeccion(id, boton) {
  document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
  if (boton) boton.classList.add("active");

  if (id === "menuSemanal") mostrarMenu("lunes");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function calcularPlan() {
  const peso = Number(document.getElementById("peso").value);
  const altura = Number(document.getElementById("altura").value);
  const edad = Number(document.getElementById("edad").value);
  const entrenos = Number(document.getElementById("entrenos").value);
  const objetivo = document.getElementById("objetivo").value;

  let actividad = 1.45;
  if (entrenos >= 4) actividad = 1.55;
  if (entrenos >= 5) actividad = 1.65;

  let metabolismo = (10 * peso) + (6.25 * altura) - (5 * edad) - 161;
  let mantenimiento = metabolismo * actividad;

  let calorias = mantenimiento;
  if (objetivo === "perder") calorias -= 450;
  if (objetivo === "ganar") calorias += 250;

  const proteina = peso * 1.8;
  const grasa = peso * 0.8;
  const carbs = (calorias - (proteina * 4) - (grasa * 9)) / 4;

  const plan = {
    calorias: Math.round(calorias),
    proteina: Math.round(proteina),
    carbs: Math.round(carbs),
    grasa: Math.round(grasa)
  };

  localStorage.setItem("vertikaPlan", JSON.stringify(plan));

  document.getElementById("resultadoPlan").innerHTML = `
    <strong>Plan calculado y guardado:</strong><br>
    Calorías: ${plan.calorias} kcal/día<br>
    Proteína: ${plan.proteina} g/día<br>
    Carbohidratos: ${plan.carbs} g/día<br>
    Grasas: ${plan.grasa} g/día
  `;
}

function mostrarMenu(dia) {
  const nombres = {
    lunes: "Lunes", martes: "Martes", miercoles: "Miércoles",
    jueves: "Jueves", viernes: "Viernes", sabado: "Sábado", domingo: "Domingo"
  };

  let html = `<div class="notice"><strong>${nombres[dia]}</strong> · Menú con cantidades orientativas</div>`;

  menus[dia].forEach(comida => {
    html += `
      <article class="meal-card">
        <h3>${comida[0]}</h3>
        <p>${comida[1]}</p>
      </article>
    `;
  });

  document.getElementById("menuDia").innerHTML = html;
}

function guardarProgreso() {
  const peso = document.getElementById("pesoSemana").value;
  const cintura = document.getElementById("cintura").value;
  const sensacion = document.getElementById("sensacion").value;

  const registro = {
    fecha: new Date().toLocaleDateString("es-ES"),
    peso,
    cintura,
    sensacion
  };

  let historial = JSON.parse(localStorage.getItem("vertikaProgreso")) || [];
  historial.push(registro);
  localStorage.setItem("vertikaProgreso", JSON.stringify(historial));

  pintarProgreso();
}

function pintarProgreso() {
  const caja = document.getElementById("historialProgreso");
  if (!caja) return;

  let historial = JSON.parse(localStorage.getItem("vertikaProgreso")) || [];

  if (historial.length === 0) {
    caja.innerHTML = "Todavía no hay registros guardados.";
    return;
  }

  let html = "<strong>Últimos registros:</strong><br>";
  historial.slice(-6).reverse().forEach(item => {
    html += `${item.fecha} · ${item.peso} kg · cintura ${item.cintura} cm · ${item.sensacion}<br>`;
  });

  caja.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  pintarProgreso();
  mostrarMenu("lunes");
});


/* ===== VÉRTIKA FIT 4.0 DASHBOARD PREMIUM ===== */
const vertikaConfig={pesoInicial:80,pesoActual:80,pesoObjetivo:72,cinturaInicial:97,proteina:145,calorias:1900};
const frasesVertika=["La disciplina pesa gramos. Los resultados pesan kilos.","Pequeñas acciones repetidas crean grandes cambios.","No necesitas motivación todos los días. Necesitas dirección.","Hoy no se negocia contigo: hoy se avanza.","Move. Teach. Inspire.","Tu mejor versión también se entrena.","Un día más cumpliendo es un día menos dudando."];
function fechaClaveHoy(){return new Date().toISOString().slice(0,10)}
function actualizarSaludoVertika(){const saludo=document.getElementById("saludoAna");if(!saludo)return;const hora=new Date().getHours();let texto="Buenos días, Ana ☀️";if(hora>=14&&hora<21)texto="Buenas tardes, Ana ☀️";if(hora>=21||hora<6)texto="Buenas noches, Ana ☀️";saludo.textContent=texto}
function actualizarFraseVertika(){const frase=document.getElementById("fraseDia");if(!frase)return;const hoy=new Date();const index=hoy.getDate()%frasesVertika.length;frase.textContent=frasesVertika[index]}
function actualizarProgresoPeso(){const fill=document.getElementById("pesoProgress");const texto=document.getElementById("progresoTexto");if(!fill||!texto)return;const total=vertikaConfig.pesoInicial-vertikaConfig.pesoObjetivo;const avanzado=vertikaConfig.pesoInicial-vertikaConfig.pesoActual;const porcentaje=Math.max(0,Math.min(100,Math.round((avanzado/total)*100)));fill.style.width=porcentaje+"%";texto.textContent=porcentaje===0?"Punto de partida: 80 kg. Próxima meta: 79 kg.":`Has recorrido el ${porcentaje}% del camino hacia tu objetivo.`}
function cargarMisiones(){const hoy=fechaClaveHoy();const guardado=JSON.parse(localStorage.getItem("vertikaMisiones")||"{}");const misionesHoy=guardado[hoy]||{};document.querySelectorAll(".mission-check").forEach(check=>{const key=check.dataset.mission;check.checked=Boolean(misionesHoy[key]);check.addEventListener("change",guardarMisiones)});actualizarContadorMisiones()}
function guardarMisiones(){const hoy=fechaClaveHoy();const guardado=JSON.parse(localStorage.getItem("vertikaMisiones")||"{}");const misionesHoy={};document.querySelectorAll(".mission-check").forEach(check=>{misionesHoy[check.dataset.mission]=check.checked});guardado[hoy]=misionesHoy;localStorage.setItem("vertikaMisiones",JSON.stringify(guardado));actualizarContadorMisiones();actualizarRacha()}
function actualizarContadorMisiones(){const checks=Array.from(document.querySelectorAll(".mission-check"));const total=checks.length;const completadas=checks.filter(c=>c.checked).length;const counter=document.getElementById("missionCounter");const progress=document.getElementById("missionProgress");if(counter)counter.textContent=`${completadas}/${total} completadas`;if(progress)progress.style.width=total?`${(completadas/total)*100}%`:"0%"}
function actualizarRacha(){const guardado=JSON.parse(localStorage.getItem("vertikaMisiones")||"{}");let racha=0;for(let i=0;i<365;i++){const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);const dia=guardado[key];if(!dia)break;const valores=Object.values(dia);const completo=valores.length>=5&&valores.every(Boolean);if(completo)racha++;else break}const rachaDias=document.getElementById("rachaDias");const rachaTexto=document.getElementById("rachaTexto");if(rachaDias)rachaDias.textContent=racha;if(rachaTexto){if(racha===0)rachaTexto.textContent="Completa las 5 misiones de hoy para iniciar tu racha.";if(racha===1)rachaTexto.textContent="Primer día conseguido. Ahora toca mantenerlo.";if(racha>1)rachaTexto.textContent=`Llevas ${racha} días cumpliendo. No rompas la racha.`}}
document.addEventListener("DOMContentLoaded",()=>{actualizarSaludoVertika();actualizarFraseVertika();actualizarProgresoPeso();cargarMisiones();actualizarRacha()});
