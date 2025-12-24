# Genealogy Viewer
*Version 1.0 - Digital Reconstruction*

## Project Overview
This application serves as a digital interface for our genealogy records. The goal is to preserve the physical manuscript while making the content accessible for descendants who do not read Chinese (like me).

## Disclaimer
> [!WARNING]
> This translation is largely done with AI. I am not a historian, and I do not have an deep understanding of the genealogy. I have tried my best, but I cannot guarantee the accuracy of the translation.

## How It's Made
The application is created using Next.js and Tailwind CSS. The data is stored in a YAML file for human-readability, which is then parsed at runtime.

### The Digitization Process
1.  **Photography**: The original physical source was photographed (available as "Scans" in the app).
2.  **Transcription**: Using AI, each page was transcribed column by column.
3.  **Translation**: AI was used to translate the records. Every line underwent several passes to manually collect the most accurate and consistent translation. *This is where the major source of human error would come in.*
4.  **Manual Extraction**: Certain metadata was manually structured:
    *   Column Elevation (Honorific spacing)
    *   Marginalia (Notes)
    *   Historical Events
    *   Dates and Locations (Approximated from Chinese Lunar Calendar to Western dates using AI)

## Data Structure
The application uses a YAML-based data source (`data.yaml` & `family_tree.yaml`) to ensure human readability and easy archival.

*   `metadata`: Global document attributes.
*   `migration`: Geospatial coordinates for the map visualization.
*   `pages`: Array of page objects, each containing content columns, marginalia, and event data.

## Note on Transliteration
Romanization follows the **Pinyin** standard. Historical place names are mapped to their approximate modern coordinates where precise historical locations are unavailable.

## Contact
Made by **Tassilo Heinemann**
Write me questions @ tassilodheinemann@gmail.com
