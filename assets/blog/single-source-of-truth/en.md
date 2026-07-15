This portfolio has no CMS, no database, no backend. Yet home, about, experience, projects, the CV page, and the downloadable CV PDF all say the same thing without ever drifting apart. The trick is a single folder: `src/app/core/data`.

## One array, not three copies

All the text content lives in a handful of typed TypeScript arrays: `experience.ts`, `projects.ts`, `social-links.ts`, `blog.registry.ts` (yes, this article is an entry in there too). Each typed by a model in `core/models/`. Components — `home`, `about`, `experience`, `cv`, the blog — import them directly and render them. No intermediate layer. To change what the site says, I edit a data file, not a template.

## The `...Key` convention

In `experience.ts` most fields aren't text but something like `roleKey: 'experience.work.sandrini.role'`. Those are i18n keys resolved via `| translate`, with the actual text in `it.json`/`en.json`. One array, both languages, no duplicated structure.

Deliberate exceptions: `company`, `name`, `institution` (proper nouns don't get translated) and blog title/excerpt, which stay literal because bilingualism there is handled by Markdown, not i18n.

The catch: nothing checks missing keys at build time. Typo a key and you get the raw string instead of translated text — silent, doesn't break anything, but you have to spot it by eye.

## Same data, different views

`WORK_EXPERIENCES` is one array, but `/experience` renders it as-is while `/cv` re-sorts it by end date first. Add a job and it shows up correctly ordered on both pages, no extra work.

## The blog is a partial exception

`blog.registry.ts` holds metadata only — slug, date, tags, title, excerpt. The body (this text) is separate Markdown per language under `public/assets/blog/<slug>/<lang>.md`, fetched over HTTP and rendered client-side. A TS array is fine for two fields, awkward for a full article with code blocks — better to write it as Markdown and keep the metadata (title, SEO) prerendered and instantly available.

## What about the PDF?

The "download PDF" button on `/cv` doesn't re-read `core/data`: it screenshots (jsPDF + html2canvas) the DOM Angular already rendered with that same data. Not a parallel source, just another output downstream.

## The trade

No CMS to maintain, nothing to keep in sync. The cost is no automated check on i18n keys. Works fine solo; with more than one author you'd probably want a real headless CMS.
