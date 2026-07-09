export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;    // "YYYY-MM"
  iconUrl?: string;
  url?: string;
}
