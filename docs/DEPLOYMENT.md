# Deployment

## Static build

```sh
npm ci
npm run build
```

Publish `dist/` through a static web server. No environment variables or runtime secrets are required.
The production site URL is configured in `astro.config.mjs`.

## Docker / Coolify

The Dockerfile builds with Node.js 24 and serves the result through Nginx on port 80.

```sh
docker build -t games-library .
docker run --rm -p 8080:80 games-library
```

## Production application

| Setting | Value |
| --- | --- |
| Coolify application | `games-library` |
| Application UUID | `atugukceaowk8e5mboq0qbnm` |
| Project / environment | `apps` / `production` |
| Source | `https://github.com/asbjborg/games-library` |
| Deploy branch | `main` |
| Build / internal port | Dockerfile / `80` |
| Public URL | `https://games.soeborg-madsen.dk` |
| Authentication | Public, without accounts |
| Runtime secrets / persistent data | None |

The application uses Coolify's public Git source. No repository deploy key is needed.
This is an intentional exception to the hosting runbook's private-repository setup.
GitHub-hosted runners validate the public repository. No self-hosted runner is registered for it.

Coolify administration remains private through Tailscale. Pushes do not automatically deploy this application.
Use the checked deployment command below after merging changes.

Configure the root host as `https://games.soeborg-madsen.dk`.
Preserve the separate Lattice application's higher-priority `/lattice` route.
The hub's play links use the absolute public Lattice URL, including during local previews.

Nginx serves real files and directory indexes. Unknown paths return the custom 404 page.
Do not replace this with an SPA fallback. It could hide an incorrect Lattice routing rule.

Hashed Astro assets receive immutable caching. HTML is revalidated.
Original design documents and PNG mockups are not copied into the published build.

## Verification

1. Run `npm run build` and `npm test`, then review the local preview.
2. Push a pull request and wait for `Check site`, including its Docker build, to pass.
3. Merge to `main` after ship approval, then fast-forward the local checkout.
4. Wait for the `Check site` push run on the exact main commit to pass.
5. Run `npm run deploy` with Tailscale, `gh`, `op`, and Python 3 available.
6. Confirm the returned deployment completes in Coolify and uses the expected main commit.
7. Verify HTTPS, all three public pages, artwork, fonts, the blog link, and the 404 response.
8. Confirm `/lattice`, `/lattice/`, and `/lattice/build-label.txt` still serve the separate game.

`scripts/deploy.py` refuses dirty checkouts, commits that differ from remote main, and commits without passing main checks.
It reads the existing deploy-only token from `op://Private/coolify-deploy/credential` directly into memory.
It sends the request to Coolify over the private Tailscale network. It never writes the token to a file or log.

A successful command confirms that Coolify accepted the request. It does not confirm a completed deployment.
Rollback by reverting the affected source commit and deploying the checked main branch again.

Opening or playing Lattice is not part of the hub's automated browser tests.
