# Content data

This folder is the site's content. There is no CMS or backend: every page you see —
home, about, experience, projects, CV — reads from a typed array declared here. To
change what the site says, edit these files (and, for translated fields, the i18n
JSON below); you should not need to touch component or template code.

Each array's shape is defined by a model in `../models/`, which is the authoritative
place for field-level documentation (formats, optionality, what each field feeds).

## The `...Key` convention

Most text fields are **not** literal strings — they're i18n lookup keys resolved at
render time via Angular's `| translate` pipe (e.g. `job.roleKey | translate`). The
actual text lives in `public/assets/i18n/it.json` and `en.json`, nested to match the
key path (`experience.work.sandrini.role` → `experience.work.sandrini.role`).

**When you add or rename a `...Key` field's value, you must add/update the matching
key in both `it.json` and `en.json`.** Nothing checks this at build time — a missing
key renders as the raw key string instead of failing.

Fields that are NOT keys (plain literal text, not translated): `company`, `name`,
`institution` — proper nouns that read the same in both languages.

## Files

- `experience.ts` — work history, skills, languages, education, certifications
  (`/experience`, `/cv`). `WORK_EXPERIENCES` order doesn't matter for the CV (it's
  re-sorted there by end date); it does matter for `/experience`, which renders as-is.
  `SKILLS` is derived from `SKILL_GROUPS` (flattened) for the CV's one-line list.
- `projects.ts` — `/projects`, in display order.
- `social-links.ts` — footer/about/CV contact links. `EMAIL` is separate from
  `SOCIAL_LINKS` because it's used individually as a CTA, not just listed.
