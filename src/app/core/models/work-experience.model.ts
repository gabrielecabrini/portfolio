export interface WorkExperience {
  id: string;
  company: string;
  roleKey: string;
  startDate: string;   // "YYYY-MM"
  endDate?: string;    // "YYYY-MM" — undefined means present
  descriptionKey: string;
  logoUrl?: string;
  url?: string;
}
