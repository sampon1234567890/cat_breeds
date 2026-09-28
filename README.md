# Meowpedia 🐾

A bubbly, clean mobile cat breed encyclopedia with full CRUD. **Expo Router + React Native** frontend, **PHP REST API** backend on Freehostia (`sev123.mooo.com`, Bearer token auth), plus a **third-party public API** (Cat Facts) integrated on the dashboard.

## Structure

- `app/` — Expo Router screens
  - `(tabs)/index.js` — Home dashboard (search, sort & filter, FAB, live Cat Fact banner)
  - `(tabs)/favorites.js` — Favorites (breeds you ♥ liked)
  - `breed/[id].js` — in-depth breed detail page
  - `add-breed.js`, `edit/[id].js` — create / edit forms
- `api/` — API clients: `breedApi.js` (custom REST API) + `catFactApi.js` (third-party Cat Facts API)
- `components/` — reusable UI: `BreedCard`, `HeroHeader`, `FilterBar`, `CatFactCard`, `CatDoodle`, `PressableScale`, `ConfirmDialog`, `FormField`
- `context/` — `FavoritesContext.js` (favorites persisted locally in AsyncStorage)
- `backend/` — PHP files + SQL to deploy to Freehostia `public_html`

## Design

- **Blue-violet theme**: `#6C63FF` primary, blue-violet gradients everywhere (hero, FAB, save buttons, toast), soft blue chips and pills.
- **Vector icons, no emoji**: all symbols come from `@expo/vector-icons` (**MaterialCommunityIcons**) — heart likes, pencil/trash actions, cat/paw logos, filter chips, tab bar icons, toast badge. (The "All" ✨ and "Popular" 🔥 chips, plus the ✨ update toast, use emoji because those two glyphs are absent from the bundled icon font.)
- **Rubber-band bounce** (`hooks/useRubberBand.js`): drag past the very top or very bottom of any list/detail page and it stretches, then springs back — phone-style.
- **Design tones**: soft lavender page background (`#EFEDFB`) with white cards outlined by `#E6E0F7` borders so breeds pop instead of blending in.
- **Desktop-friendly**: on web the app renders as a centered rounded phone frame (max-width 480) floating on a deep blue-violet backdrop with subtle cat doodles — no stretched full-width UI on laptop screens.
- **Bottom tabs**: Home and Favorites via Expo Router `Tabs`; add/edit/detail screens push on top of the stack.
- **Favorites like-a-post**: every card has a heart button (filled when saved, outlined when not) overlaid on its photo; saved ids persist in AsyncStorage (`meowpedia_favorites`).
- **Breed detail page**: tapping a card opens `breed/[id]` — a rounded photo hero (or gradient placeholder) with the name + origin pinned over it, a floating pencil shortcut to edit, a facts row (lifespan / popularity / searches), a sectioned "About this breed" card, and a full-width favorites CTA that flips to rose when saved.
- **Sort & filter bar** (`components/FilterBar.js`): a floating card under the hero with a modern count pill and horizontal chips — All, Popular, Searched, Newest, A–Z, Z–A, each with a MaterialCommunityIcons glyph. Powered by the `popularity` / `search_count` columns on the backend.
- **Cat doodles** (`components/CatDoodle.js`, react-native-svg): monochrome white line-art cats sit quietly in the blue-violet hero background.
- Animations powered by **react-native-reanimated** (already bundled): spring card entrance (staggered), bouncy press feedback (`PressableScale`), spring pop on the delete dialog.
- **Center toast notifications** (`components/Toast.js` + `useToast()`): a gradient box with a vector cat logo badge shows "Breed created", "Breed updated", "Breed deleted" with a matching icon in the center of the screen.
- Card actions are **icon-only circular buttons** (pencil / trash) with accessible labels; FAB "+" (plus icon) for adding breeds; delete confirm uses a custom in-app dialog.

## Third-Party Public API

- **Cat Facts API** — `https://catfact.ninja/fact` (public, no API key required)
- Used by the **Cat Fact** banner (`components/CatFactCard.js` → `api/catFactApi.js`) on the Home dashboard: fetches a random cat fact (JSON `{ fact, length }`) over HTTP, renders it cleanly, and refreshes on demand with the shuffle button.

## Run the app

```sh
npx expo start
```

Scan the QR with Expo Go (or press `a` for Android emulator). The app loads breeds from `http://sev123.mooo.com` — the `.mooo.com` free subdomain has **no HTTPS (port 443 doesn't respond)**, so the app uses plain HTTP. Cleartext is already allowed in `app.json` (`android.usesCleartextTraffic`, iOS ATS exception).

## Backend deployment (Freehostia)

1. Run `backend/database.sql` in phpMyAdmin (database `sebamp_ampon_db`).
2. Upload `backend/*.php` and `backend/.htaccess` to `public_html`.
3. Verify `API_BASE_URL` and the token in `api/breedApi.js` match your live domain and `backend/auth.php`.

### ⚠️ Existing installs (already have seeded rows)

The filter feature adds two columns, `popularity` and `search_count`. If your live table was created before this update, run this in phpMyAdmin **before** re-uploading the new PHP files:

```sql
ALTER TABLE cat_breeds
  ADD COLUMN popularity INT NOT NULL DEFAULT 0,
  ADD COLUMN search_count INT NOT NULL DEFAULT 0;

UPDATE cat_breeds SET popularity=95, search_count=88 WHERE name='Maine Coon';
UPDATE cat_breeds SET popularity=82, search_count=64 WHERE name='Persian';
UPDATE cat_breeds SET popularity=90, search_count=91 WHERE name='Siamese';
UPDATE cat_breeds SET popularity=88, search_count=74 WHERE name='Bengal';
UPDATE cat_breeds SET popularity=86, search_count=81 WHERE name='Ragdoll';
UPDATE cat_breeds SET popularity=78, search_count=69 WHERE name='Scottish Fold';
UPDATE cat_breeds SET popularity=93, search_count=86 WHERE name='British Shorthair';
UPDATE cat_breeds SET popularity=74, search_count=58 WHERE name='Sphynx';
```

Then upload the new `backend/cat_breeds.php`. (Until you do, the app still loads and sorts fine — Popular/Searched simply keep insertion order while metrics are 0.)

## Postman smoke tests

All requests need header `Authorization: Bearer Y29kZXg6cmVzdF9hcGlfdGVzdAo=` and use **`http://`** (HTTPS is not available on this subdomain):

- `GET http://sev123.mooo.com/cat_breeds` — list
- `GET http://sev123.mooo.com/cat_breeds/1` — single
- `POST http://sev123.mooo.com/cat_breeds` — body: `{"name":"Siamese","origin":"Thailand","temperament":"Vocal","description":"...","image_url":"","lifespan":"15 years"}`
- `PUT http://sev123.mooo.com/cat_breeds/1` — same body shape
- `DELETE http://sev123.mooo.com/cat_breeds/1` — returns 204