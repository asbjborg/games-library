import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://games.soeborg-madsen.dk',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
