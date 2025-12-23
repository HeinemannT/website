# Lao Clan Genealogy Viewer
*Version 1.2.0 - Digital Reconstruction Project*

## Project Overview
This application serves as a digital interface for the genealogy records of the Lao (勞) clan from Xiaolao Village, Dongguan/Panyu. The goal is to preserve the physical manuscript while making the content accessible, searchable, and geographically contextualized for modern descendants.

## Features
*   **Digital Reconstruction**: High-fidelity rendering of the original text flow (vertical right-to-left) with synchronized English translations.
*   **Interactive Map**: Visualizes the migration path of the clan from the Yuan Dynasty to the modern Republic era.
*   **Contextual Annotation**: Support for "Tai-tou" (honorific elevation), interlinear notes, and marginalia.
*   **Bilingual Search**: Search across both the original Classical Chinese and the English translation.

## Data Structure
The application uses a YAML-based data source (`data.yaml`) to ensure human readability and easy archival.
*   `metadata`: Global document attributes.
*   `migration`: Geospatial coordinates for the map visualization.
*   `pages`: Array of page objects, each containing:
    *   `content_columns`: The core text units.
    *   `marginalia`: Notes found in the margins (e.g., page numbers, divination marks).
    *   `map_data`: Specific historical events linked to paragraphs.

## Geospatial Logic & Map Data
There are two distinct ways geographical data is used in the app, and they are **decoupled**:

1.  **Global Map View (`migration` section)**:
    *   Found at the top of the `data.yaml`.
    *   **Purpose**: This powers the "Map" tab. It creates the timeline slider, the markers, and the animated travel paths.
    *   **Action Required**: If you have a specific coordinate in a column that you *also* want to appear on the global map, you must manually add it to the `migration.points` list and optionally create a `migration.path` connecting it.

2.  **Text Context Cards (`pages > columns > map_data`)**:
    *   Found nested inside specific columns.
    *   **Purpose**: This creates the "Historical Record" display card within the text flow (Text View). It shows the reader *where* the specific event mentioned in that paragraph happened.
    *   **Note**: Adding coordinates here does **not** automatically place a dot on the global map. This separation allows the global map to remain a clean overview of major movements without being cluttered by every minor birth or burial location mentioned in the text.

**Example of Text Context Data:**
```yaml
- id: 3
  text_zh: "..."
  map_data:
    event_date: "1438-11-20"
    event_type: "death"
    location_name: "Xiaolao Village"
    lat: 23.0132
    lng: 113.1165
```

## Note on Transliteration
Romanization follows the Pinyin standard. Historical place names are mapped to their approximate modern coordinates where precise historical locations are unavailable.


## Contact
Made by Tassilo Heinemann
Write me questions @ tassilodheinemann@gmail.com
