export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  url?: string;
  repoUrl?: string;
  imageUrl?: string;
}
