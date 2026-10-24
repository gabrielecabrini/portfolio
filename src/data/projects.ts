import type { Project } from '../models/project.model';

// Content for /projects, in display order. Title and description come from
// projects.<id>.{title,description} in both i18n JSON files — see src/data/README.md.
export const PROJECTS: Project[] = (
  [
    {
      id: 'runtopage',
      tags: ['URL Shortener'],
      url: 'https://runto.page',
      imageUrl: '/assets/images/projects/runtopage.svg',
    },
    {
      id: 'servo',
      tags: ['Rust', 'Browser Engine', 'Web'],
      repoUrl: 'https://github.com/servo/servo',
      url: 'https://servo.org',
      imageUrl: '/assets/images/projects/servo.svg',
    },
    {
      id: 'sossoldi',
      tags: ['Flutter', 'Dart', 'Finance'],
      repoUrl: 'https://github.com/RIP-Comm/sossoldi',
      url: 'https://rip-comm.github.io/sossoldi/',
      imageUrl: '/assets/images/projects/sossoldi.png',
    },
    {
      id: 'winboat',
      tags: ['TypeScript', 'Docker', 'QEMU'],
      repoUrl: 'https://github.com/TibixDev/winboat',
      url: 'https://www.winboat.app',
      imageUrl: '/assets/images/projects/winboat.svg',
    },
  ] satisfies Omit<Project, 'titleKey' | 'descriptionKey'>[]
).map((p) => ({
  ...p,
  titleKey: `projects.${p.id}.title`,
  descriptionKey: `projects.${p.id}.description`,
}));
