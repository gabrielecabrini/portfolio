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
