import { firebaseConfig } from "./firebase-config.js";

const button = document.querySelector("#google-sign-in");
const message = document.querySelector("#auth-message");
const signedOut = document.querySelector("#signed-out-view");
const signedIn = document.querySelector("#signed-in-view");
const accountName = document.querySelector("#account-name");
const signOutButton = document.querySelector("#sign-out");

const configured = ["apiKey", "authDomain", "projectId", "appId"].every(
  (key) => typeof firebaseConfig[key] === "string" && firebaseConfig[key].trim()
);

if (!configured) {
  button.disabled = false;
  button.addEventListener("click", () => {
    message.textContent = "Google sign-in is being set up. Please come back soon.";
  });
} else {
  try {
    const [{ initializeApp }, authSdk] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"),
    ]);
    const auth = authSdk.getAuth(initializeApp(firebaseConfig));
    const provider = new authSdk.GoogleAuthProvider();

    authSdk.onAuthStateChanged(auth, (user) => {
      signedOut.hidden = Boolean(user);
      signedIn.hidden = !user;
      if (user) accountName.textContent = user.displayName || user.email || "friend";
      button.disabled = false;
    }, () => {
      button.disabled = true;
      message.textContent = "Sign-in could not be loaded. Please refresh and try again.";
    });

    button.addEventListener("click", async () => {
      button.disabled = true;
      message.textContent = "";
      try {
        await authSdk.signInWithPopup(auth, provider);
      } catch (error) {
        const messages = {
          "auth/unauthorized-domain": "This website needs to be added to Firebase authorized domains.",
          "auth/operation-not-allowed": "Google sign-in needs to be enabled in Firebase.",
          "auth/popup-blocked": "Your browser blocked the Google pop-up. Please allow pop-ups and retry.",
          "auth/network-request-failed": "Connection lost. Check your internet and retry.",
        };
        if (error.code !== "auth/popup-closed-by-user" && error.code !== "auth/cancelled-popup-request") {
          message.textContent = messages[error.code] || "Sign-in failed. Please try again.";
        }
      } finally {
        button.disabled = false;
      }
    });

    signOutButton.addEventListener("click", async () => {
      signOutButton.disabled = true;
      try {
        await authSdk.signOut(auth);
      } catch {
        signedIn.querySelector("p").textContent = "Sign-out failed. Please try again.";
      } finally {
        signOutButton.disabled = false;
      }
    });
  } catch {
    button.disabled = true;
    message.textContent = "Sign-in could not be loaded. Please refresh and try again.";
  }
}
