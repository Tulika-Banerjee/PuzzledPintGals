# Puzzled Pint Gals · Christmas Wonder

A React + Vite site with **real WebGL/Three.js 3D scenes**: an interactive modeled snow globe, GLSL aurora shader, textured-photo 3D gallery, and opening 3D Christmas present. The existing Advent Calendar puzzles have been preserved as an embedded legacy module so there is no need to recreate all 24 game engines before launch.

## What's preserved

- All 24 existing puzzle formats and their configured starter questions
- The five friend links (`#upasana`, `#savani`, `#ramyani`, `#shreya`, `#priya`)
- Upasana's 24 embedded pictures, now extracted into `public/memories/upasana/`
- Date layout, puzzle hints, completion, photo reveals and flip-to-answer interaction
- Test controls, reset solved puzzles, preview all photos
- LocalStorage progress under the original `adv:<friend>` keys (same-origin storage)

**Migration note:** The original puzzle interface currently runs inside `public/legacy.html` as a same-origin iframe, underneath a new React/3D shell. This is deliberate: it keeps all puzzle engines and existing interactions stable while the 3D experience is developed. The calendar itself has not yet been rewritten as native React components. The 3D snow globe, shader, gallery and gift are actual Three.js objects.

## Uploading to GitHub (no terminal necessary)

1. Download the ZIP bundle from ChatGPT and extract it on your computer.
2. Open https://github.com/Tulika-Banerjee/PuzzledPintGals
3. Select **Add file → Upload files**; upload the **contents** of the extracted `PuzzledPintGals-project` folder. All files and folders must be at the repository root: `package.json`, `src`, `public`, `vite.config.js`, and `.github`. **GitHub's web uploader can be awkward with nested folders**; GitHub Desktop is easier for a full project, particularly its hidden `.github` directory. See CLI alternative below.
4. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. View the **Actions** tab for the build. Once successful, the website will be at https://tulika-banerjee.github.io/PuzzledPintGals/.

### Most reliable upload (GitHub Desktop)

- Install [GitHub Desktop](https://desktop.github.com/) and sign in.
- Clone the empty `Tulika-Banerjee/PuzzledPintGals` repository to your computer.
- Copy everything **inside** this project folder into the cloned repository folder (including hidden `.github`).
- In GitHub Desktop, commit your changes and click **Push origin**.
- In the GitHub website, set Settings → Pages → **GitHub Actions**.

### Command-line alternative

```bash
# From the directory containing this project's files
# Run once in an empty cloned repository directory:
npm install
npm run build
# Then add, commit, and push with Git.
```

Or to push this package into the empty remote without cloning first:

```bash
git init
git branch -M main
git remote add origin https://github.com/Tulika-Banerjee/PuzzledPintGals.git
git add .
git commit -m "Launch Puzzled Pint Gals 3D calendar"
git push -u origin main
```

## Local preview

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

The browser will show a local URL. You can use `npm run build` and `npm run preview` to check the production bundle.

## How it's organized

- `src/components/SnowGlobe.jsx` — interactive WebGL glass globe with modeled cabin/trees and 3D particles
- `src/components/Aurora.jsx` — custom GLSL fragment shader background, animated slowly
- `src/components/MemoryGallery.jsx` — real 3D photo-textured gallery
- `src/components/GiftScene.jsx` — 3D gift box with animated lid
- `src/App.jsx` — homepage, friend routing, progress, gallery, gift and embedded calendar integration
- `src/style.css` — pastel editorial styling and responsive layouts
- `src/data/photos.json` — photo manifest
- `public/memories/upasana/` — 24 unique JPG photos
- `public/legacy.html` — existing complete puzzle engines, data, and photo reveal functionality
- `.github/workflows/deploy.yml` — deploy on pushes to main

## Editing puzzles and photos

For now, change puzzle configurations in `public/legacy.html` under `FRIENDS` and the starter puzzle definitions. To add photos for other friends, put images under `public/memories/<friend>/` and update both their `photos` mapping in `legacy.html` and `src/data/photos.json`.

Note: song-game audio and larger data-dependent games currently contain starter content; check all puzzles and answers before sharing. The finale gift message is currently a generic placeholder in `src/App.jsx`.

## Important privacy note

GitHub Pages publishes all site files publicly, including `public/memories/upasana/`. Solving a puzzle hides a picture in the interface but does **not** prevent visitors from obtaining the photo URLs. Do not upload private photos without permission. This site has no authentication.

## Testing status

Static file checks and the legacy puzzle JavaScript syntax have been checked locally. The npm registry was inaccessible in the artifact-build environment, so a full `npm install` / `npm run build` and browser interaction check of the new React frontend could not be run here. The GitHub Actions build is the source of truth: if it fails, inspect the error log and fix the indicated package or code issue before sharing.
