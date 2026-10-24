// Content schema for one entry on /projects. See src/data/README.md.
export interface Project {
  id: string;
  // i18n keys (src/i18n/{it,en}.json) derived from `id`, resolved via `t()`.
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  url?: string;
  repoUrl?: string;
  imageUrl?: string;
}
