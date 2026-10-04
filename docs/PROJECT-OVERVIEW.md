# Games Library Project Overview

This repository owns the public game hub for `games.soeborg-madsen.dk`.
Games remain separate applications with their own source, builds, and releases.

## Repository relationships

```text
games-library
  ├── presents and links to → lattice
  └── follows deployment conventions from → hosting
```

`lattice` was previously named `rts-game-1`. The game was previously called Hex RTS.
Those names remain in the original design sheet, which records the initial exploration.

## Hub implementation

The hub uses Astro and TypeScript. Astro generates static pages and optimized images.
The public site requires no client JavaScript, runtime service, database, or credentials.
Self-hosted fonts avoid external font requests.

The site provides:

1. A cinematic featured-game page at `/`.
2. A catalogue of playable games at `/library/`.
3. A short introduction at `/about/`.
4. A helpful 404 page for unknown hub routes.

Only Lattice appears in this release. Future games remain in [Game concepts](GAME-CONCEPTS.md).
The future-library mockup explores scale. It does not describe a committed roadmap.

## Lattice

Lattice is the first playable game in the collection. Its GitHub repository is `asbjborg/lattice`.
Its current renderer uses Three.js.
The hub does not import the game or its simulation.

The game focuses on energy networks, photon routing, mineral mining, territory expansion,
enemy waves, laser defences, and repair systems.

The current link is `https://games.soeborg-madsen.dk/lattice/`.
This was checked against the game's deployment documentation on 4 October 2026.
The entry is defined in `src/data/games.ts`.

## Hosting boundary

The `hosting` repository owns the Hetzner/Coolify platform and shared publication process.
The hub provides a Dockerfile and static Nginx configuration. It uses internal port 80.

Coolify must route `/lattice` and its descendants to the separate Lattice application.
That rule must take priority over the hub's root route. The hub must not serve a catch-all SPA page.

Preparing deployment files does not publish this site. See [Deployment](DEPLOYMENT.md).

## Ownership

| Concern | Owner |
| --- | --- |
| Catalogue, navigation, artwork, and site pages | `games-library` |
| Game rules, rendering, saves, and game release | `lattice` |
| VPS, Coolify, DNS, deployment keys, shared runners | `hosting` |

When adding a game, add its catalogue entry and presentation here.
Keep its implementation and deployment in its own repository.

## Related local repositories

- [Lattice](../../lattice/README.md)
- [Lattice deployment](../../lattice/docs/DEPLOYMENT.md)
- [Shared hosting platform](../../hosting/docs/vps-platform.md)
- [Coolify publication runbook](../../hosting/docs/publish-a-repo-with-coolify.md)
