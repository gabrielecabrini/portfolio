import { Project } from '../../app/core/models/project.model';

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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Hello_World_Brainfuck.png/250px-Hello_World_Brainfuck.png',
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
