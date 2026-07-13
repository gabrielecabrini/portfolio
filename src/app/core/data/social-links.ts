import { SocialLink } from '../models/social-link.model';

export const EMAIL: SocialLink = {
  name: 'gabriele.cabrini@proton.me',
  href: 'mailto:gabriele.cabrini@proton.me',
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='4' width='20' height='16' rx='2'/%3E%3Cpath d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/%3E%3C/svg%3E",
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
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg',
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
