# Blog

Each post has two independent sources that must stay in sync:

1. **Metadata** — an entry in `core/data/blog.registry.ts` (`BLOG_POSTS`): slug, date,
   tags, and a literal (not i18n-keyed) title/excerpt per language. This is plain data,
   present synchronously, and is what gets prerendered into the static HTML — it's what
   search engines and social-media unfurls see.
2. **Body** — Markdown files at `public/assets/blog/<slug>/<lang>.md`, one per language
   in `langs`. The body is fetched over HTTP client-side by `blog-post/blog-post.ts`
   and rendered with `marked`; it is not part of the prerendered payload.

This split exists because the metadata needs to be available instantly (SEO, the list
page, the `<title>`/meta tags set before the body loads), while the body is arbitrary
long-form content better authored as Markdown than baked into a TS array.

## Adding a post

1. Add an entry to `BLOG_POSTS` in `core/data/blog.registry.ts` (see that file's
   comment on display order — it is not auto-sorted by date).
2. Create `public/assets/blog/<slug>/<lang>.md` for every language listed in `langs`.
   A missing file means `blog-post.ts` renders its error state for that language.
3. Nothing else — `app.routes.server.ts`'s `getPrerenderParams` reads `BLOG_POSTS`
   directly, so the new slug is picked up and prerendered automatically at build time.

## Not-found handling

`blog-post.ts` treats "no registry entry for this slug" as a hard redirect to
`/blog/not-found` (a real route, prerendered, `noindex`). A missing *Markdown file* for
an otherwise-valid slug is a softer, in-page error state instead — the post metadata
(title, tags, date) still renders, only the body area shows an error.
