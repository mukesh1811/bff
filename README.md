# BFF

A static sign-in page for **Bot Friend Forever**. No build step: `index.html`, `styles.css`, and `app.js` can be served directly, including from GitHub Pages.

Google sign-in uses Firebase Authentication project `bot-friend-forever`. The public web app config is in `firebase-config.js`; the Google provider and `mukesh1811.github.io` authorized domain are configured in the Firebase console. The button opens a Google sign-in pop-up, then shows the signed-in account and a sign-out button. There is no application area after sign-in yet.

To preview locally, run `python3 -m http.server 8000` in this directory and open `http://localhost:8000`.
