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

Use the existing platform procedure in the `hosting` repository to configure Coolify.
Preparing these files does not create or change a Coolify application.

Configure the root host as `https://games.soeborg-madsen.dk`.
Preserve the separate Lattice application's higher-priority `/lattice` route.
The hub's play links use the absolute public Lattice URL, including during local previews.

Nginx serves real files and directory indexes. Unknown paths return the custom 404 page.
Do not replace this with an SPA fallback. It could hide an incorrect Lattice routing rule.

Hashed Astro assets receive immutable caching. HTML is revalidated.
Original design documents and PNG mockups are not copied into the published build.

## Verification

1. Run `npm run build` and `npm test`.
2. Review the local home, library, and about pages on desktop and mobile widths.
3. Publish through the existing hosting platform after the local review and a deployment request.
4. Verify the public pages and the separate Lattice route after deployment.

Opening or playing Lattice is not part of the hub's automated browser tests.
