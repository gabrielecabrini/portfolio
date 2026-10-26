import type { SocialLink } from '../models/social-link.model';

// Kept separate from SOCIAL_LINKS (rather than folded in) because it's consumed
// individually by home/about/cv for the "email me" CTA, not just iterated as a list.
// iconUrl is an inline SVG data URI (not a CDN icon like the others) so the mail
// glyph never depends on an external request.
export const EMAIL: SocialLink = {
  name: 'gabriele@gabrielecabrini.it',
  href: 'mailto:gabriele@gabrielecabrini.it',
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='4' width='20' height='16' rx='2'/%3E%3Cpath d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/%3E%3C/svg%3E",
};

// Internal, so href is a site path that callers localise; icon inlined like EMAIL's.
export const PGP_LINK: SocialLink = {
  name: 'PGP',
  href: '/pgp',
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='7.5' cy='15.5' r='5.5'/%3E%3Cpath d='m21 2-9.6 9.6'/%3E%3Cpath d='m15.5 7.5 3 3L22 7l-3-3'/%3E%3C/svg%3E",
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/gabrielecabrini',
    iconUrl: 'https://cdn.simpleicons.org/github/181717',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    name: 'GitLab',
    href: 'https://gitlab.com/gabrielecabrini',
    iconUrl: 'https://cdn.simpleicons.org/gitlab',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/gabrielecabrini/',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/gabrielecabrini',
    iconUrl: 'https://cdn.simpleicons.org/telegram',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
];
