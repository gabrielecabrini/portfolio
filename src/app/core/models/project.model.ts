// Content schema for one entry on /projects and in the CV. See core/data/README.md.
export interface Project {
  id: string;
  // i18n keys (public/assets/i18n/{it,en}.json), resolved via `| translate`.
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  url?: string;
  repoUrl?: string;
  imageUrl?: string;
}
