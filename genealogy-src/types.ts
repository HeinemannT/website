

export interface DocumentMetadata {
  title: string;
  surname: string;
  recorder: string;
  origin_location: string;
  compilation_notes: string;
}

export interface MapData {
  event_date: string | null;
  event_type: string;
  location_name: string;
  lat?: number;
  lng?: number;
}

export interface NormalizedEntity {
  name: string;
  gregorian_date: string;
  event?: string;
}

export interface ContentColumn {
  id: number;
  elevation: number; // 0 or -1 (raised)
  is_interlinear: boolean;
  text_zh: string;
  translation: string;
  translator_note?: string;
  map_data?: MapData;
  normalized_entities?: NormalizedEntity[];
  geography_data?: {
    orientation: string;
  };
}

export interface MarginaliaItem {
  position: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'center_right' | 'margin';
  text: string;
  note?: string;
}

export interface PageMetadata {
  image_file: string;
  physical_page_number: string | null;
  title: string; // Acts as summary
  marginalia: MarginaliaItem[];
  archival_marks?: string[];
}

export interface PageData {
  page_id: string;
  metadata: PageMetadata;
  columns: ContentColumn[];
}

export interface MigrationPoint {
  id: string;
  name: string;
  year: number;
  coordinates: { lat: number; lng: number };
  description: string;
  era: string;
}

export interface MigrationPath {
  fromId: string;
  toId: string;
  year: number;
}

export interface GenealogyData {
  metadata: DocumentMetadata;
  pages: PageData[];
  migration: {
    points: MigrationPoint[];
    paths: MigrationPath[];
  };
}

export interface GlossaryTerm {
  term: string; // English
  zh: string;   // Chinese
  definition: string;
}

export interface GlossaryData {
  terms: GlossaryTerm[];
}