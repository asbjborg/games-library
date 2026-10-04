import type { ImageMetadata } from 'astro';
import latticeArtwork from '../assets/lattice-hero.png';

export interface Game {
  id: string;
  title: string;
  genre: string;
  tagline: string;
  description: string;
  url: string;
  platform: string;
  players: string;
  artwork: ImageMetadata;
}

export const lattice = {
  id: 'lattice',
  title: 'Lattice',
  genre: 'Real-time strategy',
  tagline: 'Build your network. Hold the line.',
  description:
    'Connect an energy network across a hexagonal world. Mine its resources, expand your territory, and keep the power flowing as enemy waves close in.',
  url: 'https://games.soeborg-madsen.dk/lattice/',
  platform: 'Browser',
  players: 'Single player',
  artwork: latticeArtwork,
} satisfies Game;

// Only playable games belong in the public catalogue. Ideas live in docs/GAME-CONCEPTS.md.
export const games: readonly Game[] = [lattice];
