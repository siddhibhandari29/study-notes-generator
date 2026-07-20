import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase-init.js";

const authScreen = document.getElementById("authScreen");
const appScreen = document.getElementById("appScreen");
const userEmailEl = document.getElementById("userEmail");
const authError = document.getElementById("authError");
const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");

document.getElementById("signupBtn").addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
  } catch (err) {
    showAuthError(err.message);
  }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
  } catch (err) {
    showAuthError(err.message);
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => signOut(auth));

function showAuthError(message) {
  authError.textContent = message.replace("Firebase: ", "");
  authError.hidden = false;
}

// This runs automatically whenever someone logs in or out
onAuthStateChanged(auth, (user) => {
  authError.hidden = true;
  if (user) {
    authScreen.hidden = true;
    appScreen.hidden = false;
    userEmailEl.textContent = user.email;
  } else {
    authScreen.hidden = false;
    appScreen.hidden = true;
  }
});
