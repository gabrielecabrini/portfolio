import { Project } from '../models/project.model';

export const PROJECTS: Project[] = [
  {
    id: 'sossoldi',
    titleKey: 'projects.sossoldi.title',
    descriptionKey: 'projects.sossoldi.description',
    tags: ['Flutter', 'Dart', 'Finance'],
    repoUrl: 'https://github.com/RIP-Comm/sossoldi',
    url: 'https://rip-comm.github.io/sossoldi/',
    imageUrl: 'https://github.com/RIP-Comm/sossoldi/raw/main/assets/iosicon.png',
  },
  {
    id: 'brainfucker',
    titleKey: 'projects.brainfucker.title',
    descriptionKey: 'projects.brainfucker.description',
    tags: ['Go', 'LLVM IR', 'Brainfuck'],
    repoUrl: 'https://github.com/gabrielecabrini/brainfucker',
    imageUrl: 'https://www.pngkey.com/png/detail/624-6245823_hello-world-brainfuck-brainfuck-hello-world.png',
  },
  {
    id: 'winboat',
    titleKey: 'projects.winboat.title',
    descriptionKey: 'projects.winboat.description',
    tags: ['TypeScript', 'Docker', 'QEMU'],
    repoUrl: 'https://github.com/TibixDev/winboat',
    url: 'https://www.winboat.app',
    imageUrl: 'https://www.winboat.app/_astro/winboat_logo.NqN8dmd9.svg',
  },
  {
    id: 'rdoh',
    titleKey: 'projects.rdoh.title',
    descriptionKey: 'projects.rdoh.description',
    tags: ['Rust', 'DNS', 'DNSSEC'],
    repoUrl: 'https://github.com/gabrielecabrini/rdoh',
  },
  {
    id: 'tcp-proxy',
    titleKey: 'projects.tcp-proxy.title',
    descriptionKey: 'projects.tcp-proxy.description',
    tags: ['Rust', 'Tokio', 'Networking'],
    repoUrl: 'https://github.com/gabrielecabrini/tcp-proxy',
  },
];
