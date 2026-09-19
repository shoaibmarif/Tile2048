# Tile 2048 Monorepo

A production-ready, high-performance monorepo for **Tile 2048** ([tile2048.netlify.app](https://tile2048.netlify.app/)), built following the Master Architecture & Boilerplate specification.

## Structure

- **`packages/core`**: Zero-dependency, platform-agnostic TypeScript 2048 game engine with move validation, non-cascading merge mechanics, undo stack, board size flexibility (3x3 to 6x6), and an Expectimax / heuristic AI hint solver with Vitest unit test suite.
- **`packages/web`**: High-performance React 19 + Vite + Tailwind CSS web application optimized for 100/100 Lighthouse performance, responsive touch gestures, dark/classic/neon themes, synthesized Web Audio sound effects, and Google Search SEO compliance (Rule A Favicons, Rule B Schema.org, Rule C Zero-FOUC noscript, Rule D Privacy meta).
- **`packages/extension`**: Manifest V3 Google Chrome Extension with popup interface (play offline anytime with auto-save) and background service worker with context menus.
- **`scripts/build-favicons.mjs`**: Automated headless Chrome icon generation script producing all PNG sizes and multi-size `.ico`.

## Quick Start

```bash
# Install dependencies
npm install

# Run core tests
npm test

# Run web app in development
npm run dev:web

# Build for production
npm run build
```

## Author

**Shoaib M. Arif**
- 🌐 Portfolio: [shoaibarif.vercel.app](https://shoaibarif.vercel.app/)
- 💻 GitHub: [@shoaibmarif](https://github.com/shoaibmarif/)
- 💼 LinkedIn: [shoaibmarif](https://www.linkedin.com/in/shoaibmarif/)
