# Genealogy Viewer
*Version 1.0 - Digital Reconstruction*

## Project Overview
This application serves as a digital interface for our genealogy records. The goal is to preserve the physical manuscript while making the content accessible for descendants who do not read Chinese (like me).

## Disclaimer
> [!WARNING]
> This translation is largely done with AI. I am not a historian, and I do not have an deep understanding of the genealogy. I have tried my best, but I cannot guarantee the accuracy of the translation.

## How It's Made
The application is created using Next.js and Tailwind CSS. The data is stored in a YAML file for human-readability, which is then parsed at runtime.

1.  The scans of the scrolls were photographed - also available to view as the images.
2.  Using AI, each page was transcribed column by column.
3.  AI was used to translate the records. I did several passes for every line to manually collect the most accurate and consistent translation. *This is where the major source of human error would come in.*
4.  Certain metadata was manually extracted:
    *   Column Elevation (for accurate honorific placements)
    *   Marginalia (Notes)
    *   Historical Events
    *   Dates and Locations (Approximated from Chinese Lunar Calendar to Western dates using AI)

## Data Structure
The application uses a YAML-based data source (`data.yaml` & `family_tree.yaml`) to ensure human readability and easy archival.

*   `metadata`: Global document attributes.
*   `migration`: Geospatial coordinates for the map visualization.
*   `pages`: Array of page objects, each containing content columns, marginalia, and event data.

## Note on Transliteration
Romanization follows the **Pinyin** standard. Historical place names are mapped to their approximate modern coordinates.

## Contact
Made by **Tassilo Heinemann**
Write me questions or corrections @ tassilodheinemann@gmail.com
