// `name` is display text as-is (proper nouns like "Java", "Kotlin" aren't translated).
// `descriptionKey` (when present) and `categoryKey` below are i18n keys, resolved via `t()`;
// in src/data they are derived from `id`.
export interface Skill {
  id: string;
  name: string;
  descriptionKey?: string;
  iconUrl?: string;
}

export interface SkillGroup {
  id: string;
  categoryKey: string;
  skills: Skill[];
}
