export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string; // "YYYY-MM"
  iconUrl?: string;
  url?: string;
  // Credential/certificate number printed on the certificate, shown as-is.
  credentialId?: string;
}
