import type { WorkExperience } from '../models/work-experience.model';
import type { Skill, SkillGroup } from '../models/skill.model';
import type { Certification } from '../models/certification.model';
import type { Education } from '../models/education.model';
import type { Language } from '../models/language.model';

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
      location: 'Costa Volpino (BG)',
      logoUrl: '/assets/images/logos/sandrini-metalli.webp',
    },
    {
      id: 'skyblockpuro',
      company: 'SkyBlockPuro',
      startDate: '2024-01',
      remote: true,
      endDate: '2025-09',
      logoUrl: '/assets/images/logos/skyblockpuro.webp',
    },
    {
      id: 'r1se-gaming',
      company: 'R1SE Gaming Publisher LLC',
      startDate: '2022-07',
      location: 'Dubai',
      remote: true,
      endDate: '2023-03',
      logoUrl: '/assets/images/logos/r1se-gaming.webp',
    },
    {
      id: 'metamc-networks',
      company: 'MetaMC Networks',
      startDate: '2022-04',
      remote: true,
      endDate: '2023-03',
      logoUrl: '/assets/images/logos/metamc-networks.webp',
    },
    {
      id: 'devroom',
      company: 'DevRoom',
      startDate: '2022-08',
      remote: true,
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
          iconUrl: '/assets/icons/java.svg',
        },
        {
          id: 'kotlin',
          name: 'Kotlin',
          iconUrl: '/assets/icons/kotlin.svg',
        },
        {
          id: 'typescript',
          name: 'TypeScript',
          iconUrl: '/assets/icons/typescript.svg',
        },
        {
          id: 'dart',
          name: 'Dart',
          iconUrl: '/assets/icons/dart.svg',
        },
        {
          id: 'rust',
          name: 'Rust',
          // Brand-coloured rather than devicon's black logo, which vanishes on the dark theme.
          iconUrl: '/assets/icons/rust.svg',
        },
      ],
    },
    {
      id: 'frameworks',
      skills: [
        {
          id: 'spring-boot',
          name: 'Spring Boot',
          iconUrl: '/assets/icons/spring.svg',
        },
        {
          id: 'angular',
          name: 'Angular',
          iconUrl: '/assets/icons/angular.svg',
        },
        {
          id: 'astro',
          name: 'Astro',
          iconUrl: '/assets/icons/astro.svg',
        },
        {
          id: 'flutter',
          name: 'Flutter',
          iconUrl: '/assets/icons/flutter.svg',
        },
      ],
    },
    {
      id: 'database',
      skills: [
        {
          id: 'postgresql',
          name: 'PostgreSQL',
          iconUrl: '/assets/icons/postgresql.svg',
        },
        {
          id: 'sql-server',
          name: 'SQL Server',
          iconUrl: '/assets/icons/microsoftsqlserver.svg',
        },
        {
          id: 'mariadb',
          name: 'MariaDB',
          iconUrl: '/assets/icons/mariadb.svg',
        },
        {
          id: 'redis',
          name: 'Redis',
          iconUrl: '/assets/icons/redis.svg',
        },
        {
          id: 'cassandra',
          name: 'Cassandra',
          iconUrl: '/assets/icons/apachecassandra.svg',
        },
      ],
    },
    {
      id: 'devops',
      skills: [
        {
          id: 'docker',
          name: 'Docker',
          iconUrl: '/assets/icons/docker.svg',
        },
        {
          id: 'kubernetes',
          name: 'Kubernetes',
          iconUrl: '/assets/icons/kubernetes.svg',
        },
      ],
    },
    {
      id: 'observability',
      skills: [
        {
          id: 'prometheus',
          name: 'Prometheus',
          iconUrl: '/assets/icons/prometheus.svg',
        },
        {
          id: 'grafana',
          name: 'Grafana',
          iconUrl: '/assets/icons/grafana.svg',
        },
        {
          id: 'elk',
          name: 'Elastic Stack',
          iconUrl: '/assets/icons/elasticsearch.svg',
        },
      ],
    },
    {
      id: 'infra',
      skills: [
        {
          id: 'linux',
          name: 'Linux',
          iconUrl: '/assets/icons/linux.webp',
        },
        { id: 'proxmox', name: 'Proxmox', iconUrl: '/assets/icons/proxmox.svg' },
        {
          id: 'vmware',
          name: 'VMware vSphere',
          iconUrl: '/assets/icons/vsphere.svg',
        },
        {
          id: 'git',
          name: 'Git',
          iconUrl: '/assets/icons/git.svg',
        },
      ],
    },
  ] satisfies Omit<SkillGroup, 'categoryKey'>[]
).map((g) => ({ ...g, categoryKey: `experience.skills.cat.${g.id}` }));

export const SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);

export const LANGUAGES: Language[] = (
  [
    { id: 'italian', iconUrl: '/assets/icons/flag-it.svg' },
    { id: 'english', iconUrl: '/assets/icons/flag-gb.svg' },
  ] satisfies Omit<Language, 'nameKey' | 'levelKey'>[]
).map((l) => ({
  ...l,
  nameKey: `experience.lang.${l.id}.name`,
  levelKey: `experience.lang.${l.id}.level`,
}));

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
    id: 'fortinet-nse-3',
    name: 'NSE 3 Certified in Cybersecurity',
    issuer: 'Fortinet',
    date: '2026-11',
    iconUrl: '/assets/images/logos/fortinet-nse-3.webp',
    url: 'https://www.credly.com/badges/bdf046a3-52b7-42b0-8ef1-910a7becdcdc',
  },
  {
    id: 'gsom-polimi-image-text-dl',
    name: 'Image and Text Analysis with Deep Learning',
    issuer: 'GSOM · Politecnico di Milano',
    date: '2026-05',
    iconUrl: '/assets/images/logos/polimi.webp',
  },
];
