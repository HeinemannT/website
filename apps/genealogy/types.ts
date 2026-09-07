

export interface DocumentMetadata {
  title: string;
  surname: string;
  recorder: string;
  origin_location: string;
  compilation_notes: string;
}

export interface MapData {
  event_date?: string | null;
  event_type: string;
  location_name: string;
  location_status?: string;
  subject?: string;
  original_calendar: string;
  original_date: string;
  date_precision: string;
  normalization_status: string;
  year_start?: number;
  year_end?: number;
  source_url?: string;
  page_ref: string;
  column_ref: number;
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
  year: number | null;
  year_end?: number;
  date_label: string;
  event_type: string;
  page_ref: string;
  column_refs: number[];
  evidence: string;
  coordinate_precision: string;
  coordinates: { lat: number; lng: number } | null;
  description: string;
  era?: string;
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
