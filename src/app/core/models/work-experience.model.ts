// Content schema for one CV/experience-page entry. See core/data/README.md for how
// this ties into i18n and where entries are declared.
export interface WorkExperience {
  id: string;
  company: string;
  // i18n key (public/assets/i18n/{it,en}.json), not literal text — resolved via `| translate`.
  roleKey: string;
  startDate: string;   // "YYYY-MM"
  endDate?: string;    // "YYYY-MM" — undefined means present, rendered as "Present"/"Presente"
  // i18n key, see roleKey.
  descriptionKey: string;
  logoUrl?: string;
}
