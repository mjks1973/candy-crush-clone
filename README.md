# Candy Pop Party

A match-3 candy puzzle game for kids and families, built as an installable Progressive Web App (PWA). Plain HTML, CSS and JavaScript with no build step and no dependencies.

- 15 levels with move limits, 1–3 stars and goals: reach a score, collect candies, clear jelly, break ice and chocolate
- Special candies: striped (match 4), wrapped (L or T shape) and colour bomb (match 5), plus combos when two specials are swapped
- Boosters: hammer and shuffle, plus a free +5 moves once per attempt
- Touch friendly: swipe a candy, or tap two neighbours
- Progress (unlocked levels, stars, best scores) is saved in the browser
- Works offline after the first visit and installs to the home screen with its own icon

## Project layout

```
public/                 everything Vercel serves
  index.html            page shell, PWA meta tags
  styles.css
  js/engine.js          board logic (matches, specials, gravity, blockers, goals); no DOM
  js/levels.js          level definitions
  js/game.js            canvas rendering, input, screens, saved progress, install button
  sw.js                 service worker (offline support)
  manifest.webmanifest  app name, colours and icons
  icons/                app icon (icon.svg is the source) and rendered PNGs
scripts/
  simulate.js           bot playthroughs of every level for difficulty tuning
  render-icons.py       re-renders the PNG icons from icons/icon.svg
vercel.json             static hosting config and headers
```

## Run locally

```
npm run dev
```

Then open http://localhost:5173. The service worker only registers over http(s), not from a `file://` page.

## Deploy to Vercel

1. In Vercel, choose **Add New → Project** and import this GitHub repository.
2. Leave the defaults. `vercel.json` sets the framework to "Other", skips the build and serves the `public` folder.
3. Deploy. Every push to `main` redeploys.

## Install on a phone

- **Android (Chrome):** open the site and tap **Install the app** on the level map, or use the browser menu → *Install app*.
- **iPhone / iPad (Safari):** tap **Share**, then **Add to Home Screen**.

## Making changes

- Edit levels in `public/js/levels.js`, then run `npm run simulate` to see bot win rates and score spreads per level.
- If you add new files that the game needs offline, add them to `SHELL` in `public/sw.js` and bump `VERSION`.
- Changed the icon? Edit `public/icons/icon.svg` and run `npm run icons` (needs Python Playwright and Chrome).
