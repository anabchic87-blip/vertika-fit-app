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
