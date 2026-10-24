// `name` is display text as-is (proper nouns like "Java", "Kotlin" aren't translated).
// `categoryKey` below is an i18n key, resolved via `t()`; in src/data it is derived from `id`.
export interface Skill {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface SkillGroup {
  id: string;
  categoryKey: string;
  skills: Skill[];
}
