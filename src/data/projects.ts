import type { Project } from '../models/project.model';

// Content for /projects, in display order. New entries need matching
// titleKey/descriptionKey strings added to both i18n JSON files — see
// src/data/README.md.
export const PROJECTS: Project[] = [
  {
    id: 'servo',
    titleKey: 'projects.servo.title',
    descriptionKey: 'projects.servo.description',
    tags: ['Rust', 'Browser Engine', 'Web'],
    repoUrl: 'https://github.com/servo/servo',
    url: 'https://servo.org',
    imageUrl: '/assets/images/projects/servo.svg',
  },
  {
    id: 'sossoldi',
    titleKey: 'projects.sossoldi.title',
    descriptionKey: 'projects.sossoldi.description',
    tags: ['Flutter', 'Dart', 'Finance'],
    repoUrl: 'https://github.com/RIP-Comm/sossoldi',
    url: 'https://rip-comm.github.io/sossoldi/',
    imageUrl: '/assets/images/projects/sossoldi.png',
  },
  {
    id: 'winboat',
    titleKey: 'projects.winboat.title',
    descriptionKey: 'projects.winboat.description',
    tags: ['TypeScript', 'Docker', 'QEMU'],
    repoUrl: 'https://github.com/TibixDev/winboat',
    url: 'https://www.winboat.app',
    imageUrl: '/assets/images/projects/winboat.svg',
  },
];
