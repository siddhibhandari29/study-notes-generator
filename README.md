# Study Notes Generator

A simple web app that turns pasted text into bullet-point notes or a paragraph
summary, plus flip-able flashcards — all running in your browser, no server
or API key needed.

## What this actually is (read this first)

Your project brief describes a full AI system: NLP models, vector embeddings,
live lookups against Wikipedia/arXiv, a recommendation engine. That needs a
paid AI API and a backend server — it can't run on GitHub Pages (which only
hosts static files) and isn't a beginner weekend build.

What you have here instead is a **real, working MVP** of the core idea —
"paste messy text, get clean notes + flashcards back" — built with plain
JavaScript using a classic technique called **extractive summarization**
(it scores sentences by how many important words they contain, and picks
the highest-scoring ones). No AI API, no cost, deploys anywhere for free.

If you later want to swap in a real AI model (Claude, GPT, etc.) instead of
the JS scoring logic, that only requires changing the `generateStudyGuide()`
function in `script.js` to call an API — everything else stays the same.

## Step 1 — Create a GitHub account
Go to [github.com](https://github.com) and sign up (skip if you already have one).

## Step 2 — Create a new repository
1. Click the **+** icon top-right → **New repository**.
2. Name it something like `study-notes-generator`.
3. Keep it **Public**.
4. Do NOT check "Add a README" (we already have one).
5. Click **Create repository**.

## Step 3 — Upload the files
1. On your new (empty) repo page, click **uploading an existing file**.
2. Drag in these four files: `index.html`, `style.css`, `script.js`, `README.md`.
3. Scroll down, click **Commit changes**.

## Step 4 — Turn on GitHub Pages
1. In your repo, click **Settings** (top tab).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and folder `/ (root)`, click **Save**.
5. Wait ~1 minute, refresh the page. A green box will show your live URL:
   `https://YOUR-USERNAME.github.io/study-notes-generator/`

That's it — your site is live and free forever.

## Step 5 — Try it
Open the URL, click **Try a sample text**, then **Generate study guide**.
You'll get bullet notes and flashcards you can click to flip.

## Making changes later
Edit any file directly on GitHub (click the pencil icon on the file page),
or re-upload an updated version — every commit auto-updates your live site
within about a minute.

## Where to go from here
- Swap the JS summarizer for a real AI model by editing `generateStudyGuide()`
  in `script.js` to call an API instead (this needs a small backend so your
  API key isn't exposed in the browser — e.g. a free Cloudflare Worker or
  Netlify Function).
- Add a "save my notes" feature using `localStorage`.
- Add real external link recommendations using a public API like Wikipedia's
  search API (no key required).
