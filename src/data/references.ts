export interface Reference {
  id: string;
  title: string;
  industry: string;
  description: string;
  isConcept: boolean;
  url?: string;
}

// Füge hier echte Referenzen ein, sobald Projekte abgeschlossen sind.
// Konzeptprojekte sind mit isConcept: true gekennzeichnet und werden entsprechend dargestellt.
export const references: Reference[] = [];
