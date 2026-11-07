import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGS, type Lang } from '../i18n';

type Entry = CollectionEntry<'blog'>;

export interface Post {
  slug: string;
  translations: Partial<Record<Lang, Entry>>;
}

/** Posts grouped by folder, newest first. Drafts still render in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('blog', (e) => import.meta.env.DEV || !e.data.draft);
  const bySlug = new Map<string, Post>();
  for (const entry of entries) {
    // id is "<folder>/<lang>"; the content.config glob only lets en/it through
    const [slug, lang] = entry.id.split('/') as [string, Lang];
    const post = bySlug.get(slug) ?? { slug, translations: {} };
    post.translations[lang] = entry;
    bySlug.set(slug, post);
  }
  return [...bySlug.values()].sort(
    (a, b) =>
      pick(b, 'en').entry.data.pubDate.valueOf() - pick(a, 'en').entry.data.pubDate.valueOf(),
  );
}

/** The version shown on a `lang` page: its own translation, else the other language's original. */
export function pick(post: Post, lang: Lang): { entry: Entry; lang: Lang } {
  const shown = post.translations[lang] ? lang : LANGS.find((l) => l !== lang)!;
  return { entry: post.translations[shown]!, lang: shown };
}

export const isTranslated = (post: Post) => LANGS.every((l) => post.translations[l]);
