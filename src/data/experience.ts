import type { WorkExperience } from '../models/work-experience.model';
import type { Skill, SkillGroup } from '../models/skill.model';
import type { Certification } from '../models/certification.model';
import type { Education } from '../models/education.model';

// Content for /experience and /cv. Order here is display order for skills/education/
// certifications; WORK_EXPERIENCES itself is re-sorted by end date in cv.ts (most
// recent/current first) so insertion order doesn't matter for that one. Translated
// fields (`...Key`) are derived from each entry's `id`, so a new entry needs its text
// under that id in both src/i18n/it.json and en.json — see src/data/README.md.
export const WORK_EXPERIENCES: WorkExperience[] = (
  [
    {
      id: 'sandrini-metalli',
      company: 'SANDRINI Metalli S.p.A.',
      startDate: '2023-04',
      logoUrl: '/assets/images/logos/sandrini-metalli.webp',
    },
    {
      id: 'skyblockpuro',
      company: 'SkyBlockPuro',
      startDate: '2024-01',
      endDate: '2025-09',
      logoUrl: '/assets/images/logos/skyblockpuro.webp',
    },
    {
      id: 'r1se-gaming',
      company: 'R1SE Gaming Publisher LLC',
      startDate: '2022-07',
      endDate: '2023-03',
      logoUrl: '/assets/images/logos/r1se-gaming.webp',
    },
    {
      id: 'metamc-networks',
      company: 'MetaMC Networks',
      startDate: '2022-04',
      endDate: '2023-03',
      logoUrl: '/assets/images/logos/metamc-networks.webp',
    },
    {
      id: 'devroom',
      company: 'DevRoom',
      startDate: '2022-08',
      endDate: '2024-02',
      logoUrl: '/assets/images/logos/devroom.png',
    },
  ] satisfies Omit<WorkExperience, 'roleKey' | 'descriptionKey'>[]
).map((w) => ({
  ...w,
  roleKey: `experience.work.${w.id}.role`,
  descriptionKey: `experience.work.${w.id}.description`,
}));

export const SKILL_GROUPS: SkillGroup[] = (
  [
    {
      id: 'languages',
      skills: [
        {
          id: 'java',
          name: 'Java',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
        },
        {
          id: 'kotlin',
          name: 'Kotlin',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg',
        },
        {
          id: 'typescript',
          name: 'TypeScript',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
        },
        {
          id: 'dart',
          name: 'Dart',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg',
        },
        {
          id: 'rust',
          name: 'Rust',
          // Brand-coloured rather than devicon's black logo, which vanishes on the dark theme.
          iconUrl: 'https://cdn.simpleicons.org/rust/DEA584',
        },
      ],
    },
    {
      id: 'frameworks',
      skills: [
        {
          id: 'spring-boot',
          name: 'Spring Boot',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg',
        },
        {
          id: 'angular',
          name: 'Angular',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg',
        },
        {
          id: 'astro',
          name: 'Astro',
          iconUrl: 'https://cdn.simpleicons.org/astro',
        },
        {
          id: 'flutter',
          name: 'Flutter',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
        },
      ],
    },
    {
      id: 'database',
      skills: [
        {
          id: 'postgresql',
          name: 'PostgreSQL',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
        },
        {
          id: 'sql-server',
          name: 'SQL Server',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',
        },
        {
          id: 'mariadb',
          name: 'MariaDB',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mariadb/mariadb-original.svg',
        },
        {
          id: 'redis',
          name: 'Redis',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
        },
        {
          id: 'cassandra',
          name: 'Cassandra',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cassandra/cassandra-original.svg',
        },
      ],
    },
    {
      id: 'devops',
      skills: [
        {
          id: 'docker',
          name: 'Docker',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
        },
        {
          id: 'kubernetes',
          name: 'Kubernetes',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg',
        },
        {
          id: 'aws',
          name: 'AWS',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
        },
      ],
    },
    {
      id: 'observability',
      skills: [
        {
          id: 'prometheus',
          name: 'Prometheus',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prometheus/prometheus-original.svg',
        },
        {
          id: 'grafana',
          name: 'Grafana',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/grafana/grafana-original.svg',
        },
        {
          id: 'elk',
          name: 'Elastic Stack',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg',
        },
      ],
    },
    {
      id: 'infra',
      skills: [
        {
          id: 'linux',
          name: 'Linux',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
        },
        { id: 'proxmox', name: 'Proxmox', iconUrl: 'https://cdn.simpleicons.org/proxmox' },
        { id: 'vmware', name: 'VMware vSphere', iconUrl: 'https://cdn.simpleicons.org/vmware' },
        {
          id: 'git',
          name: 'Git',
          iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
        },
      ],
    },
  ] satisfies Omit<SkillGroup, 'categoryKey'>[]
).map((g) => ({ ...g, categoryKey: `experience.skills.cat.${g.id}` }));

export const SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);

export const LANGUAGES: Skill[] = (
  [
    {
      id: 'italian',
      name: 'Italiano',
      iconUrl: 'https://flagcdn.com/it.svg',
    },
    {
      id: 'english',
      name: 'English',
      iconUrl: 'https://flagcdn.com/gb.svg',
    },
  ] satisfies Omit<Skill, 'descriptionKey'>[]
).map((l) => ({ ...l, descriptionKey: `experience.lang.${l.id}.level` }));

export const EDUCATION: Education[] = (
  [
    {
      id: 'afp-patronato',
      institution: 'AFP Patronato S. Vincenzo',
      startDate: '2019',
      endDate: '2022',
      location: 'Endine Gaiano (BG)',
    },
  ] satisfies Omit<Education, 'qualificationKey'>[]
).map((e) => ({ ...e, qualificationKey: `experience.edu.${e.id}.qualification` }));

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'gsom-polimi-image-text-dl',
    name: 'Image and Text Analysis with Deep Learning',
    issuer: 'GSOM · Politecnico di Milano',
    date: '2026-05',
    iconUrl: '/assets/images/logos/polimi.webp',
  },
  {
    id: 'kotlin-for-java-developers',
    name: 'Kotlin for Java Developers',
    issuer: 'JetBrains Academy · Coursera',
    date: '2025-06',
    iconUrl: '/assets/images/logos/jetbrains.webp',
    url: 'https://www.coursera.org/verify/C556TLSX3HOM',
  },
];
