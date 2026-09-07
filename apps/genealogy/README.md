# Lao genealogy edition

React/Vite viewer with photographed manuscript pages, Chinese transcription, English translation, family tree and event map. Run from this directory:

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

The preview is served at `/genealogy/`. Vite writes generated output to the repository-root `genealogy/` directory; edit source files here, not that build output.

## Tree and map explorers

The tree opens a compact close-family view. Search any Chinese or English name (including unnamed-child descriptions), then choose **Ancestor path** or **Descendants** to follow that person. Natural descent uses solid edges; adoption uses dashed red edges and explicit relationship labels. A person remains a single identity even when both relationships are visible. Notes and manuscript links appear in the person details.

Drag the diagram to pan. The plus/minus buttons zoom and **Fit tree** resets the viewport. With the diagram focused, arrow keys pan, `+`/`-` zoom and `Home` fits. Person cards and relationship links are keyboard buttons. On mobile, the details panel scrolls separately above the diagram.

The map starts near Shunde. All fourteen records, including two unresolved locations, remain in the compact **Recorded places** list; there are no event filters. Select a list row or map marker to focus it and reveal the full date, evidence and source link. **All places**, **Guangdong** and **South Africa** sit in a quiet strip above the map. Approximate coordinates remain approximate; Guangxi uses a regional zoom. Records sharing a coordinate link to one another without moving their markers. The map has no inferred routes or automatic playback.

**Read manuscript** opens the corresponding page. **Return to selected person/event** restores the explorer and selection; map center and zoom also survive source inspection. Links use `#page=34&view=map&event=port_elizabeth` or `#page=29&view=tree&person=gen17_zongrong`; old `#page=5` links still work. Browser Back/Forward restores page, view and selected identity. Unknown IDs are cleared when the relevant explorer loads.

Leaflet and its CSS are loaded only when Map opens. OpenStreetMap tiles are requested normally by the browser with attribution, under the [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/); the project does not download tiles in bulk or need a map API key. Tile failure leaves the complete event list usable. Reduced-motion preferences disable programmatic map flights; the diagram applies pointer movement at most once per animation frame without rerendering React. Map markers and their DOM paths are reused across selections, and map listeners/resize observers are disposed on close.

`utils/explorers.mjs` contains pure search, focused-layout, record-selection and URL helpers. `utils/placesMap.ts` owns the Leaflet instance and its lifetime. Tests cover real blank source columns, all 85 searchable identities, deterministic nonoverlapping cards, adoption, every record selection, regional zoom, and validated link round-trips. Browser review additionally checks responsive layouts, history, source return, reduced motion, and map-layer reuse.

## Editorial maintenance

Preserve `public/images/` and stable page/column IDs. Blank columns are intentional. The tests compare alignment with the 36-page source structure captured at commit `56ef18df`.

`public/editorial-changes.json` records the earlier and corrected text for substantive September 2026 changes. The visible documentation and reading guide explain sources and unresolved questions. Metadata corrections and identity merges are summarized below; the Git diff records their original values.

- Removed the unsupported Zongjing identity; corrected Ren, Huiding, Wenyao, Shangda and Yongzhao while retaining stable IDs.
- Merged Wenxian’s resumed biography and natural/adopted Zongrong records. Restored missing named and unnamed children. Natural descent uses `children`; adoption uses `adopted_children`, or an explicit label if the parent/child cannot be identified.
- Corrected the Shi/Junxi record from the small child-name insertion on page 15 and the biography on pages 19–20. Zhaogui is Junxi’s son, not Junxiu’s.
- Merged the unsupported Zhenmeng record into Zhenbei (鎮盃); restored Zhenbei’s distinct 1905 birth entry. Zhenbang’s biography remains separate.
- Corrected Lady Deng’s birth to Kangxi 11 (1672), Guozhi’s death to 1906, and the spouse-death records previously misidentified as births. Only three mapped column dates have verified Western day precision: Guozhi’s death, Lady Jin’s explicitly Western birth, and Zhenbang’s death.
- Removed invented migration routes, arrival and purchase years. Fourteen distinct place/event records include undated and unresolved locations. A burial year is not copied from the death year.

## Evidence rules

For `map_data`, `event_date` is reserved for a verified Western day and requires `normalization_status: verified`, `date_precision: day`, and `source_url`. Other records preserve their source expressions or explicit unknown status. `legacy_unverified_date` is archival metadata only and is never rendered as a verified date. Generic inherited geographic identifications are visibly labeled unverified.

Map points require an event kind, page/column references, date label, evidence category, and coordinate precision. Use `year: null` for undated events and `coordinates: null` for unresolved geography. The current dataset has no supported routes. Any future connection must provide explicit evidence and a caption explaining its schematic meaning; the current map intentionally renders point events only.

The tree renders a person once under their natural parent, with adoptive references elsewhere. If only the adoptive parent is identified, it renders there with an explicit adoption label. Uncertain names and unidentified parents are not merged by surname alone. Branches without recorded children must not imply childlessness.

`utils/evidence.mjs` supplies the date formatter, glossary-safe Markdown renderer, timeline logic, tree placement, and dataset validator. `npm test` checks the full dataset plus regressions, uncertainty filtering, invalid-reference detection, single-identity adoption rendering, source alignment, and intact citation URLs. `npm run typecheck` and build run before deployment in the Pages workflow.

Outstanding readings include 宗/宋 (the first ancestor’s wife), the twelfth-generation personal name and 廷/延 variants, the first son on page 18, two names on page 21, the traveler in the Wenxian/Yanchun entry, Shangda’s career attribution, and later handwritten spouse details. Source contradictions in early death years and lifespans remain documented locally. Further work should compare the Shunde Library genealogy and relevant archival records before resolving these.
