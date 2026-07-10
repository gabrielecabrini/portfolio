import { WorkExperience } from '../models/work-experience.model';
import { Skill } from '../models/skill.model';
import { Certification } from '../models/certification.model';

export const WORK_EXPERIENCES: WorkExperience[] = [
  {
    id: 'sandrini-metalli',
    company: 'SANDRINI Metalli S.p.A.',
    roleKey: 'experience.work.sandrini.role',
    startDate: '2023-04',
    descriptionKey: 'experience.work.sandrini.description',
    logoUrl: 'https://sc02.alicdn.com/kf/H759c70944f8a4253b771921bf6a9ee5eR.png',
  },
  {
    id: 'skyblockpuro',
    company: 'SkyBlockPuro',
    roleKey: 'experience.work.skyblockpuro.role',
    startDate: '2024-01',
    endDate: '2025-09',
    descriptionKey: 'experience.work.skyblockpuro.description',
    logoUrl: 'https://i.postimg.cc/9FD9nVsR/e54cca6c3d295e78368ae99a66a5312d.jpg',
  },
  {
    id: 'r1se-gaming',
    company: 'R1SE Gaming Publisher LLC',
    roleKey: 'experience.work.r1se.role',
    startDate: '2022-07',
    endDate: '2023-03',
    descriptionKey: 'experience.work.r1se.description',
    logoUrl: 'https://media.licdn.com/dms/image/v2/C4D0BAQHwtkeGoSsDVw/company-logo_200_200/company-logo_200_200/0/1677565726840/teleios_fz_logo?e=1785369600&v=beta&t=EiismrDde5D43V3YzHZw86tWfOdIQ4-kKSS9uZXn090',
  },
  {
    id: 'metamc-networks',
    company: 'MetaMC Networks',
    roleKey: 'experience.work.metamc.role',
    startDate: '2022-04',
    endDate: '2023-03',
    descriptionKey: 'experience.work.metamc.description',
    logoUrl: 'https://www.metamc.it/img/logo.png',
  },
  {
    id: 'devroom',
    company: 'DevRoom',
    roleKey: 'experience.work.devroom.role',
    startDate: '2022-08',
    endDate: '2024-02',
    descriptionKey: 'experience.work.devroom.description',
    logoUrl: 'https://www.devroomteam.com/_next/image?url=%2Fdevroom_icon.png&w=64&q=75',
  },
  {
    id: 'songoda',
    company: 'Songoda',
    roleKey: 'experience.work.songoda.role',
    startDate: '2022-01',
    endDate: '2022-05',
    descriptionKey: 'experience.work.songoda.description',
    logoUrl: 'https://songoda.com/branding/icon.png',
  },
  {
    id: 'techscode',
    company: 'TechsCode',
    roleKey: 'experience.work.techscode.role',
    startDate: '2021-01',
    endDate: '2022-03',
    descriptionKey: 'experience.work.techscode.description',
    logoUrl: 'https://techscode.com/images/logo.png',
  },
];

export const SKILLS: Skill[] = [
  {
    id: 'java',
    name: 'Java',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg',
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  },
  {
    id: 'angular',
    name: 'Angular',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
  },
  {
    id: 'docker',
    name: 'Docker',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  },
  {
    id: 'sql-server',
    name: 'SQL Server',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',
  },
  {
    id: 'mariadb',
    name: 'MariaDB',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mariadb/mariadb-original.svg',
  },
  {
    id: 'redis',
    name: 'Redis',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
  },
  {
    id: 'aws',
    name: 'AWS',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
  },
  {
    id: 'linux',
    name: 'Linux',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
  },
  {
    id: 'git',
    name: 'Git',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  },
  {
    id: 'golang',
    name: 'Go',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg',
  },
  {
    id: 'proxmox',
    name: 'Proxmox',
    iconUrl: 'https://cdn.simpleicons.org/proxmox',
  },
  {
    id: 'vmware',
    name: 'VMware vSphere',
    iconUrl: 'https://cdn.simpleicons.org/vmware',
  },
];

export const LANGUAGES: Skill[] = [
  {
    id: 'italian',
    name: 'Italiano',
    descriptionKey: 'experience.lang.italian.level',
    iconUrl: 'https://flagcdn.com/it.svg',
  },
  {
    id: 'english',
    name: 'English',
    descriptionKey: 'experience.lang.english.level',
    iconUrl: 'https://flagcdn.com/gb.svg',
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'kotlin-for-java-developers',
    name: 'Kotlin for Java Developers',
    issuer: 'JetBrains Academy · Coursera',
    date: '2025-06',
    iconUrl: 'https://resources.jetbrains.com/storage/products/jetbrains/img/meta/jetbrains_250x250.png',
    url: 'https://www.coursera.org/verify/C556TLSX3HOM',
  },
];
