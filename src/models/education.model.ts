export interface Education {
  id: string;
  institution: string;
  // i18n key (src/i18n/{it,en}.json) derived from `id`, resolved via `t()`.
  qualificationKey: string;
  startDate: string; // "YYYY"
  endDate: string; // "YYYY"
  location?: string;
  url?: string;
}
