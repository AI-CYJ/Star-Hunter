# Star Hunter

**Star Hunter** is a browser-based game that blends canvas-driven action with a text-adventure style story layer. It runs entirely in the client: no install, no build step, and no backend server required for the default experience.

## How to run

### Play online

Open **[https://ai-cyj.github.io/Star-Hunter/Star-Hunter.html](https://ai-cyj.github.io/Star-Hunter/Star-Hunter.html)** in a browser to play — no download or local server required (hosted with **GitHub Pages**).

### Option A — Open the HTML file (quickest)

1. Clone or download this repository.
2. Open the `Star-Hunter` folder (the one that contains `Star-Hunter.html`).
3. Double-click **`Star-Hunter.html`** or open it from your browser via **File → Open**.

All game scripts are loaded with relative paths (`./game.js`, etc.), so keep the files in the same folder layout as in the repo.

### Option B — Local static server (recommended for testing)

Some browsers are stricter about `file://` for media or future features. Serving the folder over HTTP avoids that.

From the `Star-Hunter` directory:

**Python 3**

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080/Star-Hunter.html` in your browser.

**Node (if you have npm)**

```bash
npx --yes serve -l 8080
```

Then open the URL shown in the terminal and choose `Star-Hunter.html`.

### Requirements

- A recent desktop or mobile browser with **HTML5 Canvas** and **JavaScript** enabled (e.g. current Chrome, Edge, Firefox, or Safari).
- **Audio**: click or interact once if the browser blocks autoplay until there is a user gesture.

### Controls (short overview)

- **Mouse / touch**: use the on-screen prompts; the main view is a full-screen canvas for gameplay and menus.
- **Story / adventure mode**: when the command bar is visible, type commands (Chinese or English aliases are supported) or use the quick verb buttons. **Enter** focuses the command input; **Escape** blurs it when you are not typing in another field.
- **Language**: use the **中文 / English** buttons when they appear in the UI.

## Project layout

| File | Role |
|------|------|
| `Star-Hunter.html` | Entry page, layout, and inline styles |
| `game.js` | Main game loop, rendering, input, and integration |
| `story-data.js` | Story, scenes, and adventure definitions |
| `scene-manager.js` | Scene transitions and related logic |
| `adventure-engine.js` | Parser and state for the text-adventure segments |
| `ui-overlays.js` | Overlay UI helpers |
| `Story Asset/` (optional) | Image paths referenced by the story config for backgrounds and portraits; add this folder if your checkout does not already include art |

## Open source & third-party attribution

This submission is built with **vanilla JavaScript**, **HTML**, and **CSS** only. There are **no bundled npm packages** and **no third-party runtime libraries** loaded from a CDN in the shipped `Star-Hunter.html`.

- **Web platform**: The game relies on standard web APIs (for example **Canvas 2D**, the **DOM**, and **Web Audio** where used), as implemented by the browser. These are open standards, not redistributed code assets in this repository.
- **Fonts**: The UI references **system font families** (e.g. Segoe UI, PingFang SC, Microsoft YaHei) in CSS and canvas text. Those fonts are provided by the operating system and are **not** committed as font files in this repo; licensing follows each platform’s font terms.

If you add third-party art, music, or libraries later, list them here with **name**, **version or URL**, and **license** (for example MIT, Apache-2.0, or CC BY 4.0) so judges and players can see clear attribution.


*Star Hunter — team entry. Good luck in judging.*
