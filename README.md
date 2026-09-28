# BFF

A static sign-in page for **Bot Friend Forever**. No build step: `index.html`, `styles.css`, and `app.js` can be served directly, including from GitHub Pages.

Google sign-in uses Firebase Authentication project `bot-friend-forever`. After sign-in, the page sends the Firebase ID token to a Cloud Run API. The API verifies it and writes `users/{uid}/human.md` to a private Cloud Storage bucket. The file contains the user's display name and Firebase UID. The page provides a download link.

## Deploy the API

Cloud Run and Cloud Storage require an active GCP billing account. The bucket is private; grant the Cloud Run service account `roles/storage.objectUser` on the bucket. Keep the bucket name in the server-only `BFF_BUCKET` environment variable.

1. Enable billing, Cloud Run, Cloud Build, Artifact Registry, and Cloud Storage APIs for the GCP project.
2. Create a private Cloud Storage bucket, ideally in a US region if the Cloud Storage Always Free quota is important.
3. Deploy `api/` as a Cloud Run service with public invoker access and a dedicated service account that has access only to that bucket. Set `BFF_BUCKET` to the bucket name and `FIREBASE_PROJECT_ID=bot-friend-forever`.
4. Set `apiBaseUrl` in `api-config.js` to the Cloud Run HTTPS URL, then publish the website changes.

The API checks Firebase ID tokens and allows requests from `https://mukesh1811.github.io`. There is no application area after sign-in yet.

To preview locally, run `python3 -m http.server 8000` in this directory and open `http://localhost:8000`.
