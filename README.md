# BFF

A static sign-in page for **Bot Friend Forever**. No build step: `index.html`, `styles.css`, and `app.js` can be served directly, including from GitHub Pages.

## Enable Google sign-in

1. Create or choose a Firebase project and register a web app in **Project settings → Your apps**.
2. Copy its public `apiKey`, `authDomain`, `projectId`, and `appId` into `firebase-config.js`.
3. In **Firebase Authentication → Sign-in method**, enable **Google**.
4. In **Firebase Authentication → Settings → Authorized domains**, add the domain hosting this page (for GitHub Pages: `mukesh1811.github.io`; add any custom domain separately). `localhost` is also needed for local testing if it is not already present.
5. Enable GitHub Pages for the `main` branch at the repository root if you want the page publicly hosted.

The Google button shows a setup message until the Firebase values are filled in. With Firebase configured, it opens the Google sign-in pop-up and shows the signed-in account. There is no application area after sign-in yet.

To preview locally, run `python3 -m http.server 8000` in this directory and open `http://localhost:8000`.
