// `name` is display text as-is (proper nouns like "Java", "Kotlin" aren't translated).
// `descriptionKey` (when present) and `categoryKey` below are i18n keys, resolved via `| translate`.
export interface Skill {
  id: string;
  name: string;
  descriptionKey?: string;
  iconUrl?: string;
}

export interface SkillGroup {
  categoryKey: string;
  skills: Skill[];
}
