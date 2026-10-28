import { scene } from '../lib/hero-scene';

// Fetched by HeroScene only once its canvas shows, so phones never download it
export const GET = () => Response.json(scene);
