# Study Notes Generator — with real sign in / login

## What changed from the basic version
- A real login screen (email + password), built with **Firebase Authentication** (free, made by Google).
- Every study guide you generate saves automatically to **your own account** (Firestore database).
- A "Saved guides" panel where you can click a past guide to load it back.

Why Firebase and not "just code it myself"? Storing passwords and accounts
safely needs a real backend server + database. Firebase gives you that for
free without you writing or hosting any server code — your site is still
just static files on GitHub Pages, Firebase handles the accounts part.

## Files in this project
```
index.html          the page structure (login screen + app screen)
style.css            all styling
firebase-config.js    <-- YOU edit this one, with your project's keys
firebase-init.js      connects everything to Firebase (don't need to touch)
auth.js               sign up / log in / log out logic
app.js                the study guide generator + saving/loading guides
```

## Step 1 — Create a Firebase project
1. Go to **console.firebase.google.com** → sign in with a Google account.
2. Click **Add project** → name it (e.g. `study-notes-generator`) → click through the setup (you can disable Google Analytics) → **Create project**.

## Step 2 — Register a web app and get your keys
1. On your project's home screen, click the **`</>`** (web) icon.
2. Give it a nickname (e.g. "Study Notes Web") → **Register app**.
3. Firebase shows you a code block with a `firebaseConfig = { ... }` object. Copy it.
4. Open `firebase-config.js` in this project and replace the placeholder values with your real ones. It should look like:
   ```js
   export const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "study-notes-generator.firebaseapp.com",
     projectId: "study-notes-generator",
     storageBucket: "study-notes-generator.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

## Step 3 — Turn on email/password login
1. In the Firebase console left sidebar: **Build → Authentication**.
2. Click **Get started**.
3. Click **Email/Password** in the provider list → toggle it **Enable** → **Save**.

## Step 4 — Turn on the database (Firestore)
1. Left sidebar: **Build → Firestore Database**.
2. Click **Create database** → keep the default location → choose **Start in test mode** → **Enable**.
   (Test mode is open for 30 days so you can build freely. Step 7 below locks it down properly.)

## Step 5 — Upload everything to GitHub
1. Create a GitHub account at **github.com** if you don't have one.
2. Click **+ → New repository**, name it, keep it **Public**, don't add a README → **Create repository**.
3. Click **uploading an existing file** → drag in **all files** from this project folder (`index.html`, `style.css`, `firebase-config.js`, `firebase-init.js`, `auth.js`, `app.js`, `README.md`) → **Commit changes**.

## Step 6 — Turn on GitHub Pages
1. In your repo: **Settings → Pages**.
2. Under "Build and deployment → Source" choose **Deploy from a branch**.
3. Branch: **main**, folder **/ (root)** → **Save**.
4. Wait ~1 minute, refresh — your live link appears at the top of that page.

## Step 7 — Lock down the database properly (important, do this before sharing your site widely)
Test mode lets anyone read/write anything — fine for building, not for real users.
1. Firebase console → **Firestore Database → Rules** tab.
2. Replace the rules with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/guides/{guideId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
3. Click **Publish**.
   This means each person can only ever read or write their *own* saved guides — never anyone else's.

## Step 8 — Try it
1. Open your live GitHub Pages link.
2. Type an email + a password (6+ characters) → click **Create account**.
3. You're logged in automatically. Click **Try a sample text** → **Generate study guide**.
4. Refresh the page — you're still logged in, and your guide appears under **Saved guides**.
5. Click **Log out**, then log back in with the same email/password to prove it's really saved to your account.

## Troubleshooting
- **"Firebase: Error (auth/configuration-not-found)"** — you haven't pasted your real keys into `firebase-config.js` yet, or haven't enabled Email/Password in Step 3.
- **Nothing saves / saved list stays empty** — check Firestore is enabled (Step 4) and your rules (Step 7) allow your own uid.
- **Blank page after upload** — open the browser console (F12) and check for a red error; most often it's a typo in `firebase-config.js`.

## Where to go from here
- Add **Google sign-in** as a second login option (Firebase Authentication → Sign-in method → enable Google — a few lines added to `auth.js`).
- Add a "delete guide" button next to each saved item.
- Add password reset ("Forgot password?" → `sendPasswordResetEmail`).
