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
  const section = document.getElementById(id);
  if (!section) return;
  section.classList.remove("hidden");

  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
  if (boton) boton.classList.add("active");

  if (id === "menuSemanal") mostrarMenu("lunes");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function calcularPlan() {
  if (!document.getElementById("peso")) return;
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

  const resultadoPlan = document.getElementById("resultadoPlan");
  if (resultadoPlan) {
    resultadoPlan.innerHTML = `
      <strong>Plan calculado y guardado:</strong><br>
      Calorías: ${plan.calorias} kcal/día<br>
      Proteína: ${plan.proteina} g/día<br>
      Carbohidratos: ${plan.carbs} g/día<br>
      Grasas: ${plan.grasa} g/día
    `;
  }
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

  const menuDia = document.getElementById("menuDia");
  if (menuDia) {
    menuDia.innerHTML = html;
  }
}

function guardarProgreso() {
  if (!document.getElementById("pesoSemana")) return;
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
  if (document.getElementById("menuDia")) {
    mostrarMenu("lunes");
  }
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


/* ===== VÉRTIKA FIT 6.2 TRANSFORMACIÓN ===== */
const transformConfig = {
  pesoInicial: 80,
  pesoObjetivo: 72,
  cinturaInicial: 97
};

function getTransformRecords() {
  return JSON.parse(localStorage.getItem("vertikaTransformacion") || "[]");
}

function saveTransformRecords(records) {
  localStorage.setItem("vertikaTransformacion", JSON.stringify(records));
}

function guardarTransformacion() {
  const peso = Number(document.getElementById("nuevoPesoTransform").value);
  const cintura = Number(document.getElementById("nuevaCinturaTransform").value);

  if (!peso || !cintura) {
    alert("Introduce peso y cintura para guardar la evolución.");
    return;
  }

  const records = getTransformRecords();
  records.push({
    fecha: new Date().toLocaleDateString("es-ES"),
    iso: new Date().toISOString(),
    peso,
    cintura
  });

  saveTransformRecords(records);
  if (typeof window.guardarTransformacionFirebase === "function") window.guardarTransformacionFirebase(records);

  document.getElementById("nuevoPesoTransform").value = "";
  document.getElementById("nuevaCinturaTransform").value = "";

  pintarTransformacion();
}

function getUltimoRegistroTransformacion() {
  const records = getTransformRecords();
  if (!records.length) {
    return {
      fecha: "Inicio",
      peso: transformConfig.pesoInicial,
      cintura: transformConfig.cinturaInicial
    };
  }
  return records[records.length - 1];
}

function pintarTransformacion() {
  const ultimo = getUltimoRegistroTransformacion();

  const kgPerdidos = Math.max(0, transformConfig.pesoInicial - ultimo.peso);
  const cmPerdidos = Math.max(0, transformConfig.cinturaInicial - ultimo.cintura);
  const totalKg = transformConfig.pesoInicial - transformConfig.pesoObjetivo;
  const percent = Math.max(0, Math.min(100, Math.round((kgPerdidos / totalKg) * 100)));

  const pesoActual = document.getElementById("transPesoActual");
  const kgBox = document.getElementById("transKgPerdidos");
  const cmBox = document.getElementById("transCmPerdidos");
  const percentBox = document.getElementById("transformPercent");
  const bar = document.getElementById("transformProgressBar");
  const current = document.getElementById("scaleCurrent");
  const message = document.getElementById("transformMessage");

  if (pesoActual) pesoActual.textContent = ultimo.peso.toFixed(1).replace(".0", "") + " kg";
  if (kgBox) kgBox.textContent = kgPerdidos.toFixed(1).replace(".0", "") + " kg";
  if (cmBox) cmBox.textContent = cmPerdidos.toFixed(1).replace(".0", "") + " cm";
  if (percentBox) percentBox.textContent = percent + "%";
  if (bar) bar.style.width = percent + "%";
  if (current) current.textContent = ultimo.peso.toFixed(1).replace(".0", "") + " kg";

  if (message) {
    if (percent === 0) message.textContent = "Tu punto de partida está registrado. La próxima meta es 79 kg.";
    else if (percent < 50) message.textContent = "Ya has empezado el camino. Sigue sumando semanas.";
    else if (percent < 100) message.textContent = "Vas muy bien. Ya has pasado más de la mitad del camino.";
    else message.textContent = "Objetivo alcanzado. Momento de consolidar y mantener.";
  }

  pintarHistorialTransformacion();
}

function pintarHistorialTransformacion() {
  const box = document.getElementById("transformHistorial");
  if (!box) return;

  const records = getTransformRecords();

  if (!records.length) {
    box.innerHTML = '<div class="notice">Aún no hay registros. Guarda tu primer peso y cintura para empezar.</div>';
    return;
  }

  box.innerHTML = records.slice().reverse().map((r) => {
    const kg = Math.max(0, transformConfig.pesoInicial - r.peso).toFixed(1).replace(".0", "");
    const cm = Math.max(0, transformConfig.cinturaInicial - r.cintura).toFixed(1).replace(".0", "");
    return `
      <div class="transform-item">
        <span>${r.fecha}</span>
        <span>⚖️ <strong>${r.peso} kg</strong></span>
        <span>📏 <strong>${r.cintura} cm</strong></span>
        <span>🔥 -${kg} kg</span>
        <span>📉 -${cm} cm</span>
      </div>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", pintarTransformacion);


/* ===== VÉRTIKA FIT 10.0 HOME PREMIUM ===== */
function actualizarHomePremium() {
  const records = JSON.parse(localStorage.getItem("vertikaTransformacion") || "[]");
  const ultimo = records.length ? records[records.length - 1] : { peso: 80, cintura: 97 };
  const inicial = 80;
  const objetivo = 72;
  const total = inicial - objetivo;
  const avanzado = Math.max(0, inicial - Number(ultimo.peso || 80));
  const percent = Math.max(0, Math.min(100, Math.round((avanzado / total) * 100)));

  const homePeso = document.getElementById("homePesoActual");
  const homeProgreso = document.getElementById("homeProgreso");
  if (homePeso) homePeso.textContent = Number(ultimo.peso || 80).toFixed(1).replace(".0", "") + " kg";
  if (homeProgreso) homeProgreso.textContent = percent + "%";
}
document.addEventListener("DOMContentLoaded", actualizarHomePremium);


/* ===== VÉRTIKA FIT 14 FULL EDITION ===== */
let pesoChartInstance = null;
let cinturaChartInstance = null;

function getPerfilVertikaLocal() {
  return JSON.parse(localStorage.getItem("vertikaPerfil") || "{}");
}

function setPerfilVertikaLocal(perfil) {
  localStorage.setItem("vertikaPerfil", JSON.stringify(perfil));
}

function recogerPerfilVertika() {
  return {
    nombre: document.getElementById("perfilNombre")?.value || "Ana Belén",
    edad: Number(document.getElementById("perfilEdad")?.value || 39),
    altura: Number(document.getElementById("perfilAltura")?.value || 172),
    pesoInicial: Number(document.getElementById("perfilPesoInicial")?.value || 80),
    pesoObjetivo: Number(document.getElementById("perfilPesoObjetivo")?.value || 72),
    cinturaInicial: Number(document.getElementById("perfilCinturaInicial")?.value || 97),
    entrenos: Number(document.getElementById("perfilEntrenos")?.value || 4),
    objetivo: document.getElementById("perfilObjetivo")?.value || "perder"
  };
}

function pintarPerfilVertika(perfil) {
  if (!perfil || !Object.keys(perfil).length) return;
  const fields = {
    perfilNombre: perfil.nombre,
    perfilEdad: perfil.edad,
    perfilAltura: perfil.altura,
    perfilPesoInicial: perfil.pesoInicial,
    perfilPesoObjetivo: perfil.pesoObjetivo,
    perfilCinturaInicial: perfil.cinturaInicial,
    perfilEntrenos: perfil.entrenos,
    perfilObjetivo: perfil.objetivo
  };
  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.value = value;
  });
  const estado = document.getElementById("perfilEstado");
  if (estado) estado.innerHTML = "✅ Perfil cargado correctamente.";
}

function guardarPerfilVertika() {
  const perfil = recogerPerfilVertika();
  setPerfilVertikaLocal(perfil);
  if (typeof window.guardarPerfilFirebase === "function") {
    window.guardarPerfilFirebase(perfil);
  }
  const estado = document.getElementById("perfilEstado");
  if (estado) estado.innerHTML = "✅ Perfil guardado en Firebase.";
}

function actualizarGraficasTransformacion() {
  const records = JSON.parse(localStorage.getItem("vertikaTransformacion") || "[]");
  const pesoCanvas = document.getElementById("pesoChart");
  const cinturaCanvas = document.getElementById("cinturaChart");
  if (!pesoCanvas || !cinturaCanvas || typeof Chart === "undefined") return;

  const labels = records.length ? records.map(r => r.fecha) : ["Inicio"];
  const pesos = records.length ? records.map(r => Number(r.peso)) : [80];
  const cinturas = records.length ? records.map(r => Number(r.cintura)) : [97];

  if (pesoChartInstance) pesoChartInstance.destroy();
  if (cinturaChartInstance) cinturaChartInstance.destroy();

  pesoChartInstance = new Chart(pesoCanvas, {
    type: "line",
    data: { labels, datasets: [{ label: "Peso kg", data: pesos, tension: 0.35 }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  cinturaChartInstance = new Chart(cinturaCanvas, {
    type: "line",
    data: { labels, datasets: [{ label: "Cintura cm", data: cinturas, tension: 0.35 }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

const oldPintarTransformacion = typeof pintarTransformacion === "function" ? pintarTransformacion : null;
if (oldPintarTransformacion) {
  window.pintarTransformacion = function() {
    oldPintarTransformacion();
    actualizarGraficasTransformacion();
    if (typeof actualizarHomePremium === "function") actualizarHomePremium();
  };
}

async function cargarBibliotecaVertika() {
  await cargarListadoBiblioteca("data/workouts.json", "libraryWorkouts", "🏋️");
  await cargarListadoBiblioteca("data/diets.json", "libraryDiets", "🥗");
}

async function cargarListadoBiblioteca(url, contenedorId, icono) {
  const box = document.getElementById(contenedorId);
  if (!box) return;

  try {
    const res = await fetch(url + "?v=" + Date.now());
    const items = await res.json();

    box.innerHTML = items.map(item => `
      <a class="library-item" href="${item.url}">
        <strong>${icono} ${item.title || item.titulo}</strong>
        <span>${item.duration || item.level || item.descripcion || "Abrir contenido"}</span>
      </a>
    `).join("");
  } catch (e) {
    box.innerHTML = `<div class="notice">No se pudo cargar ${url}.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  pintarPerfilVertika(getPerfilVertikaLocal());
  setTimeout(actualizarGraficasTransformacion, 300);
  cargarBibliotecaVertika();
});


/* ===== VÉRTIKA FIT 15 SMART + CONTENT MANAGER ===== */
function actualizarSmartDashboard() {
  const perfil = JSON.parse(localStorage.getItem("vertikaPerfil") || "{}");
  const records = JSON.parse(localStorage.getItem("vertikaTransformacion") || "[]");

  const pesoInicial = Number(perfil.pesoInicial || 80);
  const pesoObjetivo = Number(perfil.pesoObjetivo || 72);
  const cinturaInicial = Number(perfil.cinturaInicial || 97);
  const ultimo = records.length ? records[records.length - 1] : { peso: pesoInicial, cintura: cinturaInicial };

  const kgLost = Math.max(0, pesoInicial - Number(ultimo.peso || pesoInicial));
  const cmLost = Math.max(0, cinturaInicial - Number(ultimo.cintura || cinturaInicial));
  const nextGoal = Math.max(pesoObjetivo, Math.floor(Number(ultimo.peso || pesoInicial) - 0.1));

  const kgBox = document.getElementById("smartKgLost");
  const cmBox = document.getElementById("smartCmLost");
  const goalBox = document.getElementById("smartNextGoal");
  const msgBox = document.getElementById("smartMessage");

  if (kgBox) kgBox.textContent = kgLost.toFixed(1).replace(".0", "") + " kg";
  if (cmBox) cmBox.textContent = cmLost.toFixed(1).replace(".0", "") + " cm";
  if (goalBox) goalBox.textContent = nextGoal + " kg";
  if (msgBox) {
    if (kgLost === 0) msgBox.textContent = "Primer registro";
    else if (kgLost < 2) msgBox.textContent = "Buen inicio";
    else if (kgLost < 5) msgBox.textContent = "Vas fuerte";
    else msgBox.textContent = "Nivel VÉRTIKA";
  }
}

function getContenidosVertika() {
  return JSON.parse(localStorage.getItem("vertikaContenidos") || "[]");
}

function setContenidosVertika(items) {
  localStorage.setItem("vertikaContenidos", JSON.stringify(items));
}

function guardarContenidoVertika() {
  const type = document.getElementById("contentType")?.value || "workout";
  const title = document.getElementById("contentTitle")?.value.trim();
  const description = document.getElementById("contentDescription")?.value.trim();
  const url = document.getElementById("contentUrl")?.value.trim();

  if (!title || !url) {
    alert("Añade título y URL/ruta del contenido.");
    return;
  }

  const items = getContenidosVertika();
  const item = {
    id: Date.now().toString(),
    type,
    title,
    description,
    url,
    createdAt: new Date().toISOString()
  };

  items.push(item);
  setContenidosVertika(items);

  if (typeof window.guardarContenidoFirebase === "function") {
    window.guardarContenidoFirebase(items);
  }

  document.getElementById("contentTitle").value = "";
  document.getElementById("contentDescription").value = "";
  document.getElementById("contentUrl").value = "";

  pintarContenidosVertika();
  cargarBibliotecaVertika();
}

function pintarContenidosVertika() {
  const box = document.getElementById("managerContentList");
  if (!box) return;

  const items = getContenidosVertika();

  if (!items.length) {
    box.innerHTML = '<div class="notice">Aún no has añadido contenido propio.</div>';
    return;
  }

  box.innerHTML = items.slice().reverse().map(item => `
    <div class="manager-item">
      <strong>${item.type === "workout" ? "🏋️" : "🥗"} ${item.title}</strong>
      <span>${item.description || "Sin descripción"}</span><br>
      <a href="${item.url}">Abrir contenido</a>
    </div>
  `).join("");
}

const oldCargarBibliotecaVertikaV15 = typeof cargarBibliotecaVertika === "function" ? cargarBibliotecaVertika : null;
if (oldCargarBibliotecaVertikaV15) {
  window.cargarBibliotecaVertika = async function() {
    await oldCargarBibliotecaVertikaV15();

    const propios = getContenidosVertika();
    const workoutsBox = document.getElementById("libraryWorkouts");
    const dietsBox = document.getElementById("libraryDiets");

    propios.forEach(item => {
      const html = `
        <a class="library-item" href="${item.url}">
          <strong>${item.type === "workout" ? "🏋️" : "🥗"} ${item.title}</strong>
          <span>${item.description || "Contenido añadido por ti"}</span>
        </a>
      `;
      if (item.type === "workout" && workoutsBox) workoutsBox.insertAdjacentHTML("beforeend", html);
      if (item.type === "diet" && dietsBox) dietsBox.insertAdjacentHTML("beforeend", html);
    });
  };
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarSmartDashboard();
  pintarContenidosVertika();
});
