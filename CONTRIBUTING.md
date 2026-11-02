# Contributing

Jandi is an embeddable GitHub Contributions calendar widget designed for Notion and personal websites, supporting SVG and HTML Canvas/PNG rendering with dynamic light/dark theme synchronization. Read [README.md](README.md) and [docs/customization-and-theme-sync.md](docs/customization-and-theme-sync.md) for query parameter behavior and theme synchronization details before proposing changes.

## Issues first

Open an issue before starting substantial layout, rendering, or API changes. Good defect reports include:

- the embed URL and query parameters used (e.g., `?scheme=dark&weeks=true&radius=2`)
- whether the issue occurs in default SVG mode (`/:username`) or Canvas/PNG mode (`/:username/canvas`)
- the host environment (Notion desktop/web, custom `<iframe>`, browser, and OS theme setting)

⚠️ **Never commit or paste personal API tokens, `.env` files, or private deployment credentials in issues or pull requests.**

## Before you open a pull request

Jandi requires **Node.js 20+** and **Yarn**. Run the linter and production build from the repository root before opening a pull request:

```bash
yarn install
yarn lint
yarn build
```

For UI or theme changes, start the local dev server (`yarn dev`) and verify both `/:username` (SVG) and `/:username/canvas` (Canvas/PNG) across light and dark modes.

## What a change has to clear

- **Query parameter backward compatibility**: existing embed URLs (`scheme`, `dark`, `white`, `halloween`, `tz`, `radius`, `margin`, `weeks`, `footer`) must continue to work without breaking deployed Notion embeds.
- **SVG and Canvas parity**: visual options, palettes, and cell geometry must behave consistently across both SVG (`/:username`) and Canvas/PNG (`/:username/canvas`) routes.
- **Cross-origin theme sync**: automatic `prefers-color-scheme` propagation via CSS `color-scheme` and `window.postMessage({ scheme: 'dark' | 'light' }, '*')` must remain functional when `scheme` is omitted (`auto`).
- **Documentation parity**: when query parameters, palettes, or theme synchronization rules change, update both `README.md` and `docs/customization-and-theme-sync.md` in the same pull request.

## Commits and pull requests

Use concise, descriptive commit subjects (`feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`). Keep each pull request focused on a single concern and reference the tracking issue (`Closes #N`).

## License

Contributions are accepted under the MIT License in [LICENSE](LICENSE).
