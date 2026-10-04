# Games Library

A cinematic home for the games at [games.soeborg-madsen.dk](https://games.soeborg-madsen.dk).

The first release features **Lattice**. Only playable games appear on the site.
Future game ideas and the original mockups live in the repository documentation.

## Development

Use Node.js 24 LTS and npm. The supported minimum is Node.js 22.12.

```sh
npm ci
npm run dev
```

Open [localhost:4321](http://localhost:4321). The site has three pages:

- `/`: the featured game and its core mechanics;
- `/library/`: the playable collection;
- `/about/`: the story behind the collection.

## Build and verify

```sh
npm run build
npx playwright install chromium
npm test
npm run preview
```

The build includes Astro and TypeScript checks. Browser tests use the production build.
They check navigation, game links, image loading, keyboard access, responsive layouts, and automated WCAG rules.
They never start or play Lattice.

## Architecture

Astro builds static HTML and optimized images. The public site needs no client JavaScript.
Fonts are self-hosted. No runtime API, database, account system, or secret is required.

- `src/data/games.ts`: playable catalogue, artwork, and game URLs.
- `src/pages/`: home, library, about, and 404 pages.
- `src/components/`: shared artwork, mark, and arrow.
- `src/layouts/`: page metadata, navigation, and footer.
- `src/styles/global.css`: the cinematic design and responsive layouts.
- `src/assets/lattice-hero.png`: original production cover illustration.
- `docs/design/`: original design explorations, excluded from the published build.

Lattice is a separate application. The hub links to its permanent public URL.
See [Project overview](docs/PROJECT-OVERVIEW.md) for ownership and routing details.

## Design and ideas

- [Accepted visual direction](docs/DESIGN.md)
- [Future game concepts](docs/GAME-CONCEPTS.md)
- [Artwork provenance and prompts](docs/design/README.md)
- [Deployment](docs/DEPLOYMENT.md)

The artwork is an aspirational cover illustration. It is not a gameplay screenshot.
The initial concept sheet uses Lattice's former name, Hex RTS. Preserve it as design history.
