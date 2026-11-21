import type { SocialLink } from '../models/social-link.model';

// Apart from SOCIAL_LINKS: it's the "email me" action on its own, not a profile in the list.
export const EMAIL = {
  name: 'gabriele@gabrielecabrini.it',
  href: 'mailto:gabriele@gabrielecabrini.it',
};

// All external: /about opens them in a new tab.
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/gabrielecabrini',
    iconUrl: '/assets/icons/github.svg',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/gabrielecabrini/',
    iconUrl: '/assets/icons/linkedin.svg',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/gabrielecabrini',
    iconUrl: '/assets/icons/telegram.svg',
  },
];
