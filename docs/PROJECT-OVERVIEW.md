# Games Library Project Overview

This repository is the future public game hub for [games.soeborg-madsen.dk](https://games.soeborg-madsen.dk).

The hub is intended to catalogue and present games that are developed in separate repositories. Each game can have its own technology, release cadence, and deployment configuration while the library provides a single, friendly entry point for players.

## Repository relationships

```text
games-library
    │  public catalogue and game-entry experience
    │
    ├── links to / presents ──► Lattice
    │                             repo asbjborg/lattice
    │
    └── follows deployment conventions from ──► hosting
                                                shared VPS/Coolify platform
```

### `games-library`

This repository owns the public hub:

- the catalogue of available games;
- game cards, descriptions, artwork, and links;
- the navigation and presentation experience at `games.soeborg-madsen.dk`;
- any hub-specific build and deployment configuration.

It should not become the source of truth for an individual game's simulation, assets, or release process.

### Lattice

This is the first game intended to appear in the library. The GitHub repository is `asbjborg/lattice`. It is a playable browser-first hex RTS prototype built with TypeScript, Phaser, and Vite.

The current game focuses on:

- building and reshaping an energy network;
- photon routing and transmitter heat pressure;
- mining minerals to expand the network;
- territory expansion across a procedural axial hex grid;
- enemy waves, laser turrets, and repair bots.

The game is independently built and deployed. The library should treat it as a linked game experience rather than importing its internal source code.

### `hosting`

This repository owns the shared hosting platform and reusable deployment process:

- Hetzner VPS infrastructure;
- Coolify application management;
- Tailscale-only administration;
- repo-scoped GitHub Actions runners;
- deployment keys, DNS, firewall, and secret-management policy;
- the standard process for publishing a private repository.

Application-specific deployment details remain in each application's repository. Platform-wide decisions belong in `hosting`.

## Current deployment state

Lattice (`asbjborg/lattice`) is currently deployed as the Coolify application `hex-rts`:

| Setting | Current value |
| --- | --- |
| Repository | `asbjborg/lattice` |
| Deploy branch | `main` |
| Build | Dockerfile, static Vite output served by Nginx |
| Internal port | `80` |
| Runtime data | None; static files only |
| Runtime secrets | None currently required |
| Public URL | [temporary Coolify URL](https://stq5mbjvf9wgrn50hz7tz9cb.2.28.4.113.sslip.io/) |

The temporary `sslip.io` hostname is not the final library address. The eventual hub domain is `games.soeborg-madsen.dk`, and the library can link to the game’s configured public URL until a custom game domain or hub routing strategy is chosen.

## Intended user journey

The expected experience is:

1. A visitor opens `games.soeborg-madsen.dk`.
2. The library explains what is available and presents a catalogue of games.
3. The visitor chooses a game, starting with Lattice.
4. The hub sends the visitor to that game’s public playable experience.
5. The game remains independently deployable without requiring a hub release for every gameplay change.

The first implementation should keep this boundary simple: a static catalogue with clear game metadata and links. A shared backend, accounts, save synchronization, or cross-game services should only be introduced when a concrete product need exists.

## Ownership and change boundaries

| Concern | Owning repository |
| --- | --- |
| Catalogue layout and hub UX | `games-library` |
| Game rules, simulation, rendering, and game assets | Individual game repository, currently Lattice (`asbjborg/lattice`) |
| Shared VPS, Coolify, runners, DNS, and infrastructure policy | `hosting` |
| Game-specific container and deployment contract | The game repository |

When adding a new game, add its catalogue metadata and entry point here. Do not copy the game implementation into this repository. When changing the deployment platform, update `hosting`; when changing how a particular game is built or served, update that game's deployment documentation.

## Current status

- The hub repository is scaffolded and has no application stack yet.
- Lattice is the first playable game and is already hosted.
- The shared hosting platform and publication workflow are established.
- The next product work in this repository is to choose the hub implementation and build the first catalogue experience.

## Related documentation

- [Repository README](../README.md)
- [Lattice design notes](/Users/asbjborg/Documents/asmos/repos/lattice/docs/DESIGN.md)
- [Lattice architecture](/Users/asbjborg/Documents/asmos/repos/lattice/docs/ARCHITECTURE.md)
- [Lattice deployment guide](/Users/asbjborg/Documents/asmos/repos/lattice/docs/DEPLOYMENT.md)
- [Shared hosting platform](/Users/asbjborg/Documents/asmos/repos/hosting/docs/vps-platform.md)
- [Coolify publication runbook](/Users/asbjborg/Documents/asmos/repos/hosting/docs/publish-a-repo-with-coolify.md)
