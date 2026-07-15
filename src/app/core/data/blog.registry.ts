import { BlogPost } from '../models/blog-post.model';

// Blog metadata only. Array order is the list-page display order as-is (nothing
// re-sorts by date), so newest posts should be inserted first. Adding a post requires
// more than an entry here; see features/blog/README.md.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'single-source-of-truth',
    date: '2026-07-15',
    tags: ['angular', 'architecture', 'i18n'],
    langs: ['it', 'en'],
    translations: {
      it: {
        title: 'Un solo dato, tutto il sito: come core/data guida home, CV e PDF',
        excerpt: 'Perché questo portfolio non ha un CMS: ogni pagina, dal CV al PDF, legge dagli stessi array tipizzati in core/data.',
      },
      en: {
        title: 'One source of truth: how core/data drives the whole site, CV included',
        excerpt: 'Why this portfolio has no CMS: every page, down to the CV PDF, reads from the same typed arrays in core/data.',
      },
    },
  },
];
