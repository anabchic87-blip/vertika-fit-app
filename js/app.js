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


/* ===== VÉRTIKA FIT 4.1 ENTRENAMIENTOS ===== */

const rutinasVertika = {
  brazosHyrox: {
    titulo: "💪 Brazos + HYROX",
    descripcion: "Rutina completa de 1 hora enfocada en pérdida de grasa, tonificación, resistencia y trabajo especial de bíceps y tríceps.",
    meta: ["⏱ 60 min", "🔥 HYROX/Cardio", "💪 Brazos", "Nivel medio"],
    bloques: [
      {
        titulo: "🔥 Calentamiento · 10 min",
        ejercicios: [
          "5 min cinta inclinada o bici suave",
          "Movilidad de hombros y cadera",
          "10 sentadillas",
          "10 zancadas",
          "20 segundos de plancha",
          "15 jumping jacks"
        ]
      },
      {
        titulo: "🏋️‍♀️ Fuerza con pesas · 30 min",
        ejercicios: [
          "4 rondas · descanso 45-60 segundos",
          "Goblet Squat · 15 repeticiones",
          "Peso muerto rumano con mancuernas · 12 repeticiones",
          "Remo con mancuerna · 12 por brazo",
          "Press de hombro con mancuernas · 12 repeticiones",
          "Zancadas con mancuernas · 10 por pierna"
        ]
      },
      {
        titulo: "💪 Bíceps y tríceps · 10 min",
        ejercicios: [
          "3 vueltas con poco descanso",
          "Curl de bíceps · 12-15 repeticiones",
          "Curl martillo · 12 repeticiones",
          "Tríceps en polea · 15 repeticiones",
          "Fondos en banco · 12 repeticiones"
        ]
      },
      {
        titulo: "🔥 Final HYROX/Cardio · 10 min",
        ejercicios: [
          "2 min cinta inclinada rápida",
          "30-40 segundos Farmer Carry",
          "500 m remo o 1 min bici intensa",
          "12 Step Ups por pierna"
        ]
      }
    ],
    consejo: "Hidrátate bien, prioriza la técnica y después del entreno toma proteína y algo de carbohidrato."
  },
  pechoBrazos: {
    titulo: "🏋️ Pecho + Bíceps + Tríceps",
    descripcion: "Rutina VÉRTIKA de tren superior para trabajar pecho, brazos y terminar con bloque anaeróbico tipo HYROX.",
    meta: ["⏱ 60 min", "🏋️ Tren superior", "🔥 Anaeróbico", "Nivel medio"],
    bloques: [
      {
        titulo: "🔥 Calentamiento · 10 min",
        ejercicios: [
          "5 min cinta inclinada o remo suave",
          "Movilidad de hombros y escápulas",
          "15 jumping jacks",
          "10 flexiones apoyando rodillas si hace falta",
          "20 segundos de plancha",
          "Activación con banda elástica · 15 repeticiones"
        ]
      },
      {
        titulo: "🏋️ Pecho · 25 min",
        ejercicios: [
          "Press banca · 4 series x 10 repeticiones",
          "Press inclinado con mancuernas · 4 series x 12 repeticiones",
          "Aperturas con mancuernas · 3 series x 12 repeticiones",
          "Flexiones · 3 series x 12-15 repeticiones"
        ]
      },
      {
        titulo: "💪 Bíceps + tríceps · 15 min",
        ejercicios: [
          "Curl de bíceps · 3 series x 12 repeticiones",
          "Curl martillo · 3 series x 12 repeticiones",
          "Tríceps en cuerda/polea · 3 series x 15 repeticiones",
          "Fondos en banco · 3 series x 12 repeticiones"
        ]
      },
      {
        titulo: "🔥 Final HYROX · 10 min",
        ejercicios: [
          "3 rondas rápidas",
          "250 m remo o 1 min bici intensa",
          "30 segundos Farmer Carry",
          "12 Wall Balls",
          "10 Push Press con mancuernas"
        ]
      }
    ],
    consejo: "Usa un peso que te cueste en las últimas repeticiones, pero mantén buena técnica."
  }
};

function mostrarRutina(id) {
  const rutina = rutinasVertika[id];
  const contenedor = document.getElementById("rutinaDetalle");
  if (!rutina || !contenedor) return;

  document.querySelectorAll(".workout-tab").forEach(btn => btn.classList.remove("active"));
  const tab = document.getElementById("tab-" + id);
  if (tab) tab.classList.add("active");

  let html = `
    <article class="workout-main-card">
      <h3>${rutina.titulo}</h3>
      <p>${rutina.descripcion}</p>
      <div class="workout-meta">
        ${rutina.meta.map(item => `<span>${item}</span>`).join("")}
      </div>
      <div class="workout-block-grid">
  `;

  rutina.bloques.forEach((bloque, bloqueIndex) => {
    html += `
      <section class="workout-block">
        <h4>${bloque.titulo}</h4>
        <div class="exercise-list">
          ${bloque.ejercicios.map((ej, ejIndex) => `
            <label>
              <input type="checkbox" class="workout-check" data-rutina="${id}" data-check="${bloqueIndex}-${ejIndex}">
              ${ej}
            </label>
          `).join("")}
        </div>
      </section>
    `;
  });

  html += `
      </div>
      <div class="workout-actions">
        <button onclick="guardarEntrenoCompletado('${id}')">✅ Marcar entrenamiento completado</button>
        <button onclick="reiniciarRutina('${id}')">Reiniciar checks</button>
        <span class="workout-progress-text" id="workoutProgressText">0 ejercicios completados</span>
      </div>
      <div class="workout-tip">💡 ${rutina.consejo}</div>
    </article>
  `;

  contenedor.innerHTML = html;
  cargarChecksRutina(id);
  actualizarProgresoRutina();
}

function claveRutinaHoy(id) {
  return "vertikaRutina_" + id + "_" + new Date().toISOString().slice(0, 10);
}

function cargarChecksRutina(id) {
  const guardado = JSON.parse(localStorage.getItem(claveRutinaHoy(id)) || "{}");

  document.querySelectorAll(".workout-check").forEach(check => {
    const key = check.dataset.check;
    check.checked = Boolean(guardado[key]);
    check.addEventListener("change", () => {
      const actual = JSON.parse(localStorage.getItem(claveRutinaHoy(id)) || "{}");
      actual[key] = check.checked;
      localStorage.setItem(claveRutinaHoy(id), JSON.stringify(actual));
      actualizarProgresoRutina();
    });
  });
}

function actualizarProgresoRutina() {
  const checks = Array.from(document.querySelectorAll(".workout-check"));
  const completados = checks.filter(c => c.checked).length;
  const texto = document.getElementById("workoutProgressText");
  if (texto) texto.textContent = `${completados}/${checks.length} ejercicios completados`;
}

function guardarEntrenoCompletado(id) {
  const mes = new Date().toISOString().slice(0, 7);
  const key = "vertikaEntrenos_" + mes;
  const entrenos = JSON.parse(localStorage.getItem(key) || "[]");
  const hoy = new Date().toISOString().slice(0, 10);
  const registro = hoy + "_" + id;

  if (!entrenos.includes(registro)) {
    entrenos.push(registro);
    localStorage.setItem(key, JSON.stringify(entrenos));
  }

  actualizarContadorEntrenos();
  alert("Entrenamiento guardado en VÉRTIKA FIT ✅");
}

function reiniciarRutina(id) {
  localStorage.removeItem(claveRutinaHoy(id));
  mostrarRutina(id);
}

function actualizarContadorEntrenos() {
  const mes = new Date().toISOString().slice(0, 7);
  const entrenos = JSON.parse(localStorage.getItem("vertikaEntrenos_" + mes) || "[]");
  const count = document.getElementById("workoutMonthCount");
  if (count) count.textContent = entrenos.length;
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarRutina("brazosHyrox");
  actualizarContadorEntrenos();
});


/* ===== VÉRTIKA FIT 5.0 CONTADOR DESDE WORKOUTS ===== */
function actualizarContadorEntrenosV5() {
  const mes = new Date().toISOString().slice(0, 7);
  const entrenos = JSON.parse(localStorage.getItem("vertikaEntrenos_" + mes) || "[]");
  const count = document.getElementById("workoutMonthCount");
  if (count) count.textContent = entrenos.length;
}
document.addEventListener("DOMContentLoaded", actualizarContadorEntrenosV5);


/* ===== VÉRTIKA FIT 6.0 IA NUTRICIONAL ===== */

function generarPlanIA() {
  const peso = Number(document.getElementById("aiPeso").value || 80);
  const objetivoPeso = Number(document.getElementById("aiObjetivo").value || 72);
  const altura = Number(document.getElementById("aiAltura").value || 172);
  const edad = Number(document.getElementById("aiEdad").value || 39);
  const cintura = Number(document.getElementById("aiCintura").value || 97);
  const entrenos = Number(document.getElementById("aiEntrenos").value || 4);
  const objetivoTipo = document.getElementById("aiObjetivoTipo").value;
  const ayuno = document.getElementById("aiAyuno").value;
  const horario = document.getElementById("aiHorario").value;
  const evitar = document.getElementById("aiEvitar").value.trim();

  let actividad = 1.45;
  if (entrenos >= 4) actividad = 1.55;
  if (entrenos >= 5) actividad = 1.65;

  let metabolismo = (10 * peso) + (6.25 * altura) - (5 * edad) - 161;
  let mantenimiento = metabolismo * actividad;

  let calorias = mantenimiento;
  if (objetivoTipo === "perder") calorias -= 450;
  if (objetivoTipo === "ganar") calorias += 250;

  calorias = Math.round(calorias / 10) * 10;

  const proteina = Math.round(peso * 1.8);
  const grasas = Math.round(peso * 0.8);
  const carbs = Math.round((calorias - (proteina * 4) - (grasas * 9)) / 4);

  const plan = {
    peso, objetivoPeso, cintura, calorias, proteina, grasas, carbs,
    fecha: new Date().toLocaleDateString("es-ES")
  };

  localStorage.setItem("vertikaIAPlan", JSON.stringify(plan));

  const resultado = document.getElementById("aiResultado");
  resultado.innerHTML = `
    <div class="ai-macros">
      <div class="ai-macro"><span>🔥 Calorías</span><strong>${calorias}</strong></div>
      <div class="ai-macro"><span>💪 Proteína</span><strong>${proteina} g</strong></div>
      <div class="ai-macro"><span>🍚 Carbohidratos</span><strong>${carbs} g</strong></div>
      <div class="ai-macro"><span>🥑 Grasas</span><strong>${grasas} g</strong></div>
    </div>
    <div class="ai-note">
      Objetivo: bajar de ${peso} kg a ${objetivoPeso} kg con déficit moderado, manteniendo fuerza para HYROX.
      ${evitar ? "<br><br>Evitar o limitar: " + escaparHTML(evitar) + "." : ""}
    </div>
  `;

  generarMenuCompraIA(calorias, proteina, carbs, grasas, ayuno, horario);
}

function generarMenuCompraIA(calorias, proteina, carbs, grasas, ayuno, horario) {
  const output = document.getElementById("aiMenuCompra");
  let desayuno = "Yogur griego 0% 200 g + avena 40 g + frutos rojos 100 g";
  let media = "Proteína whey 30 g + plátano 1 unidad";
  let comida = "Pollo 150 g + arroz cocido 150 g + verduras 250 g + aceite 10 g";
  let cena = "Merluza 170 g + patata cocida 180 g + ensalada grande";

  if (ayuno === "si") {
    desayuno = "Café solo o infusión + agua. Primera comida tras la ventana de ayuno.";
    media = "Primera comida: tortilla de 2 huevos + claras 120 g + pan integral 50 g";
    comida = "Pollo 160 g + arroz cocido 170 g + verduras 250 g";
    cena = "Salmón 130 g + ensalada + patata cocida 150 g";
  }

  if (horario === "fujitsu") {
    desayuno = ayuno === "si" ? desayuno : "Antes de trabajar: yogur alto en proteína + avena 35 g + fruta";
    media = "Media mañana en Fujitsu: proteína 30 g o queso fresco batido + fruta";
    comida = "Al salir: pollo/pavo 150 g + arroz/patata + verduras";
    cena = "Cena ligera: pescado o tortilla + ensalada/verduras";
  }

  output.innerHTML = `
    <section class="ai-output-card">
      <h3>🥗 Menú recomendado de hoy</h3>
      <div class="ai-meal"><h4>Desayuno</h4><p>${desayuno}</p></div>
      <div class="ai-meal"><h4>Media mañana / post entreno</h4><p>${media}</p></div>
      <div class="ai-meal"><h4>Comida</h4><p>${comida}</p></div>
      <div class="ai-meal"><h4>Cena</h4><p>${cena}</p></div>
      <div class="ai-note">Ajusta cantidades si tienes más hambre o si el entrenamiento ha sido muy intenso.</div>
    </section>

    <section class="ai-output-card">
      <h3>🛒 Compra semanal generada</h3>
      <ul class="ai-shopping-list">
        <li>Pollo o pavo: 1,2 kg</li>
        <li>Pescado blanco: 800 g</li>
        <li>Salmón: 400 g</li>
        <li>Huevos: 12 unidades</li>
        <li>Yogur griego/proteico: 7 unidades</li>
        <li>Avena: 500 g</li>
        <li>Arroz: 1 paquete</li>
        <li>Patata o boniato: 2 kg</li>
        <li>Verduras variadas: 3 kg</li>
        <li>Fruta: 2,5 kg</li>
        <li>Aceite de oliva virgen extra</li>
      </ul>
      <div class="ai-note">Plan orientativo. Si hay patología médica, embarazo o medicación, debe revisarlo un profesional sanitario.</div>
    </section>
  `;
}

function escaparHTML(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
