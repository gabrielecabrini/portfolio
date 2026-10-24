# Content data

This folder is the site's content. There is no CMS or backend: every page you see —
home, about, experience, projects, CV — reads from a typed array declared here. To
change what the site says, edit these files (and, for translated fields, the i18n
JSON below); you should not need to touch component or template code.

Each array's shape is defined by a model in `../models/`, which is the authoritative
place for field-level documentation (formats, optionality, what each field feeds).

## The `...Key` convention

Most text fields are **not** literal strings — they're i18n lookup keys resolved at
build time by `t()` from `src/i18n` (e.g. `t(lang, job.roleKey)`). The actual text
lives in `src/i18n/it.json` and `en.json`.

**You never write a `...Key` by hand: it is derived from the entry's `id`** as
`<section>.<id>.<field>`, in a `.map()` at the end of each array:

| Array              | Keys                                                            |
| ------------------ | --------------------------------------------------------------- |
| `PROJECTS`         | `projects.<id>.title`, `projects.<id>.description`              |
| `WORK_EXPERIENCES` | `experience.work.<id>.role`, `experience.work.<id>.description` |
| `SKILL_GROUPS`     | `experience.skills.cat.<id>`                                    |
| `LANGUAGES`        | `experience.lang.<id>.name`, `experience.lang.<id>.level`       |
| `EDUCATION`        | `experience.edu.<id>.qualification`                             |

So adding an entry means: add the object (with a new `id`, no keys) and add its text
under that id in **both** `it.json` and `en.json`. Renaming an `id` means renaming
the JSON block too. The build doesn't fail on a missing key — it renders as the raw
key string — but `npm test` does (`content-i18n.spec.ts`).

Fields that are NOT keys (plain literal text, not translated): `company`, `name`,
`institution`, `location` — proper nouns and places that read the same in both
languages. `remote: true` on a work entry is rendered as "Da remoto"/"Remote".

## Files

- `experience.ts` — work history, skills, languages, education, certifications
  (`/experience`, `/cv`). `WORK_EXPERIENCES` order doesn't matter for the CV (it's
  re-sorted there by end date); it does matter for `/experience`, which renders as-is.
  `SKILLS` is derived from `SKILL_GROUPS` (flattened) for the site's structured data (`knowsAbout` in `Base.astro`).
- `projects.ts` — `/projects`, in display order.
- `social-links.ts` — footer/about/CV contact links. `EMAIL` is separate from
  `SOCIAL_LINKS` because it's used individually as a CTA, not just listed.
