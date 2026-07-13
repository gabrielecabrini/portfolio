import { BlogPost } from '../models/blog-post.model';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'still-developing',
    date: '2026-07-13',
    tags: ['meta', 'markdown'],
    langs: ['it', 'en'],
    translations: {
      it: {
        title: 'In costruzione — test markdown',
        excerpt: 'Questo spazio è ancora in sviluppo. Il primo articolo serve a testare il supporto al markdown e la struttura del blog.',
      },
      en: {
        title: 'Still developing — testing markdown',
        excerpt: 'This blog is still being developed. This first article is a placeholder to test markdown support and the overall blog structure.',
      },
    },
  },
];
