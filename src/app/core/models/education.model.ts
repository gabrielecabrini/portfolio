export interface Education {
  id: string;
  institution: string;
  qualificationKey: string;
  startDate: string;  // "YYYY"
  endDate: string;    // "YYYY"
  location?: string;
  url?: string;
}
