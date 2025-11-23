# Atoms Gemini

A modern interactive 3‑D atom visualizer built with **React** and **Vite**. The app displays realistic electron orbitals, supports multiple isotopes, and lets users explore atomic structures directly in the browser.

## Features

- Accurate s, p, d, f orbital shapes
- Dynamic electron trails
- Isotope selection UI
- Multilingual support (JSON locale files in `src/locales/`)
- FPS counter and smooth camera controls

## Prerequisites

- **Node.js** (v18 or newer) – [download](https://nodejs.org/)
- **npm** (comes with Node) or **yarn**
- **Git** (for cloning the repo)

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/atoms_gemini.git
cd atoms_gemini

# Install dependencies
npm install   # or `yarn install`
```

## Development Server

```bash
npm run dev   # or `yarn dev`
```

The app will be served at `http://localhost:5173` (or the port shown in the console). Open this URL in your browser to explore the atom visualizer.

## Building for Production

```bash
npm run build   # or `yarn build`
```

The optimized static files will be placed in the `dist/` directory. You can serve them with any static file server, e.g.:

```bash
npm install -g serve
serve -s dist
```

## Localization

Locale files are located in `src/locales/`. To add or edit translations, modify the corresponding JSON files (e.g., `en.json`, `bg.json`). The app loads the appropriate file based on the user's language settings.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes and push to your fork.
4. Open a Pull Request describing the changes.

## License

This project is licensed under the MIT License – see the `LICENSE` file for details.

---

*Enjoy exploring atoms!*
