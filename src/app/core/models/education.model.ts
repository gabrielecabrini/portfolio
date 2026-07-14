export interface Education {
  id: string;
  institution: string;
  // i18n key (public/assets/i18n/{it,en}.json), resolved via `| translate`.
  qualificationKey: string;
  startDate: string;  // "YYYY"
  endDate: string;    // "YYYY"
  location?: string;
  url?: string;
}
