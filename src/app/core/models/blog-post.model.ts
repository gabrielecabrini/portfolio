export type Lang = 'it' | 'en';

export interface BlogPostTranslation {
  title: string;
  excerpt: string;
}

export interface BlogPost {
  slug: string;
  date: string;
  tags: string[];
  langs: Lang[];
  translations: Partial<Record<Lang, BlogPostTranslation>>;
}
