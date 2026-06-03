import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.vertikaFirebase = { auth, db };
window.vertikaCurrentUser = null;

function setAuthMessage(text, type = "") {
  const box = document.getElementById("authMessage");
  if (!box) return;
  box.textContent = text;
  box.className = "auth-message " + type;
}

function firebaseConfigured() {
  return firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("PEGA_AQUI");
}

window.showAuthPanel = function(which) {
  document.getElementById("loginPanel").classList.toggle("active", which === "login");
  document.getElementById("registerPanel").classList.toggle("active", which === "register");
  document.getElementById("tabLogin").classList.toggle("active", which === "login");
  document.getElementById("tabRegister").classList.toggle("active", which === "register");
  setAuthMessage("");
};

window.registerVertika = async function() {
  if (!firebaseConfigured()) {
    setAuthMessage("Falta pegar la configuración de Firebase en js/firebase-config.js", "bad");
    return;
  }

  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!email || !password) {
    setAuthMessage("Rellena correo y contraseña.", "bad");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      email,
      createdAt: serverTimestamp(),
      marca: "VERTIKA FIT"
    }, { merge: true });
    setAuthMessage("Cuenta creada correctamente.", "ok");
  } catch (error) {
    setAuthMessage(traducirFirebaseError(error.code), "bad");
  }
};

window.loginVertika = async function() {
  if (!firebaseConfigured()) {
    setAuthMessage("Falta pegar la configuración de Firebase en js/firebase-config.js", "bad");
    return;
  }

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    setAuthMessage("Rellena correo y contraseña.", "bad");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    setAuthMessage(traducirFirebaseError(error.code), "bad");
  }
};

window.logoutVertika = async function() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
};

onAuthStateChanged(auth, async (user) => {
  window.vertikaCurrentUser = user || null;

  const authScreen = document.getElementById("authScreen");
  const layout = document.querySelector(".layout");
  const chip = document.getElementById("firebaseUserChip");

  if (!firebaseConfigured()) {
    if (authScreen) authScreen.style.display = "flex";
    if (layout) layout.style.display = "none";
    setAuthMessage("Falta configurar Firebase. Pega tus claves en js/firebase-config.js", "bad");
    return;
  }

  if (user) {
    if (authScreen) authScreen.style.display = "none";
    if (layout) layout.style.display = "flex";
    if (chip) chip.textContent = user.email;
    await cargarTransformacionDesdeFirebase();
  } else {
    if (authScreen) authScreen.style.display = "flex";
    if (layout) layout.style.display = "none";
    if (chip) chip.textContent = "Sin sesión";
  }
});

window.guardarTransformacionFirebase = async function(records) {
  const user = window.vertikaCurrentUser;
  if (!user || !records) return;

  await setDoc(doc(db, "transformaciones", user.uid), {
    uid: user.uid,
    email: user.email,
    records,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

window.cargarTransformacionDesdeFirebase = async function() {
  const user = window.vertikaCurrentUser;
  if (!user) return;

  try {
    const snap = await getDoc(doc(db, "transformaciones", user.uid));
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.records)) {
        localStorage.setItem("vertikaTransformacion", JSON.stringify(data.records));
        if (typeof pintarTransformacion === "function") pintarTransformacion();
      }
    }
  } catch (error) {
    console.error("No se pudo cargar transformación:", error);
  }
};

function traducirFirebaseError(code) {
  const errores = {
    "auth/email-already-in-use": "Ese correo ya está registrado.",
    "auth/invalid-email": "El correo no tiene un formato válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/missing-password": "Falta la contraseña.",
    "auth/network-request-failed": "Error de red."
  };
  return errores[code] || "Error: " + code;
}
