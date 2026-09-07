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

The map has one bottom transport: **Play**, previous/next dated place and reset use the same six geographic stops, from Lao Village (c. 1378) through South Africa (1955). Play immediately focuses its starting place, then moves every 2.5 seconds; consecutive records at the same coordinates are one stop, while distinct places in the same year remain separate. Play from the last stop restarts at the first. The slider and its ticks use this same sequence: scrubbing selects the latest mapped stop at or before the cursor, and selects none before the first stop. Full chronology year bounds remain available. Dragging the slider, interacting with the map/list, opening a source, hiding the tab or closing the explorer pauses playback. Reduced motion makes camera changes immediate. Undated/unresolved records remain manually accessible through the timeline link and list, without entering autoplay or receiving a date. Their date display reads **Undated**, with the retained year cursor secondary. Undated place markers remain visible at every cursor year; dated markers appear when their year is reached.

The reviewed chronology contains 191 records: the original fourteen place records plus 177 newly indexed manuscript records. Of these, 175 have a year or year range; sixteen have no resolved year. There is no event-kind dropdown. The sidebar retains every record, including entries skipped by map playback. Most added entries are life dates without recorded coordinates; only three additional burial/reburial records have event-specific approximate locations. Selecting an unlocated life event stops any camera flight and displays **Location unrecorded**. The compact list keeps reviewed uncertainty labels, immediate manuscript links and an expandable transcription/translation. Starting Play from a manually selected unlocated or undated entry immediately selects the mapped stop at or before the retained cursor, or the first mapped stop when the cursor precedes it. **Places reached** fits the currently reached mapped records. **Guangdong** and **South Africa** frame their geographic region, while the timeline still determines which dated markers are visible.

Two separately curated associations appear as dashed lines when an endpoint is selected and both place markers are reached. Page 5, columns 3–5 describes the first ancestor’s wife’s burial relocation from the home village to Xiqiao; page 36, columns 5–6 associates Zhenbang’s death at Bonishibi with burial at Queenstown. Port Elizabeth remains a tentative identification of Bonishibi. These connect approximate areas, not traced journeys, and add no dates or new event coordinates. Each connection has a visible explanation, source link and **Show both connected places** control. No connection is inferred from shared surnames, proximity or chronology alone.

**Read manuscript** opens the corresponding page. **Return to selected person/event** restores the explorer and selection; map center, zoom and timeline year also survive source inspection. Links use `#page=34&view=map&event=port_elizabeth&year=1955` or `#page=29&view=tree&person=gen17_zongrong`; old `#page=5` links still work. Browser Back/Forward restores page, view, selected identity and timeline year. Unknown IDs are cleared when the relevant explorer loads.

Leaflet and its CSS are loaded only when Map opens. OpenStreetMap tiles are requested normally by the browser with attribution, under the [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/); the project does not download tiles in bulk or need a map API key. Tile failure leaves the complete event list usable. Reduced-motion preferences disable programmatic map flights; the diagram applies pointer movement at most once per animation frame without rerendering React. Map marker instances are retained across timeline changes, and their DOM paths are reused across selections when those places remain visible, and map listeners/resize observers are disposed on close.

`utils/explorers.mjs` contains pure search, focused-layout, record-selection and URL helpers. `utils/chronology.mjs` handles chronological ordering, year bounds, actual-record stepping and reached places. `utils/placesMap.ts` owns the Leaflet lifetime. `public/chronology.json` is loaded only when Map opens, keeping the reader's initial load unchanged. Tests cover every source reference, all merged identities, same-year/end/gap playback, unlocated life records, era ranges and cursor-year links alongside the existing source and tree checks.


## Chronology dating policy

The audit checked reign-year correspondences against Academia Sinica, with an independent Wanli cross-check using the National Museum of Taiwan Literature chronology. This verifies nominal year placement, not conversion of every lunar day. Late lunar months can extend into the next Western year; same-year ordering is not asserted unless a Western date is explicitly verified. Exact Western dates, unresolved cyclical years, source contradictions, tentative readings and the Tianqi era range remain labeled. Existing manuscript YAML and photographed scans were preserved; reviewed chronology corrections and cross-page source references are recorded in the additional asset.

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

Map points require an event kind, page/column references, date label, evidence category, and coordinate precision. Use `year: null` for undated events and `coordinates: null` for unresolved geography. The manuscript dataset retains its empty routes array. The separate `public/place-connections.json` contains only source-supported place associations with explicit captions and page/column references. It does not establish traveled routes or chronological sequencing. New associations require evidence tying both endpoints to the same subject; inherited family locations alone are insufficient.

The tree renders a person once under their natural parent, with adoptive references elsewhere. If only the adoptive parent is identified, it renders there with an explicit adoption label. Uncertain names and unidentified parents are not merged by surname alone. Branches without recorded children must not imply childlessness.

`utils/evidence.mjs` supplies the date formatter, glossary-safe Markdown renderer, timeline logic, tree placement, and dataset validator. `npm test` checks the full dataset plus regressions, uncertainty filtering, invalid-reference detection, single-identity adoption rendering, source alignment, and intact citation URLs. `npm run typecheck` and build run before deployment in the Pages workflow.

Outstanding readings include 宗/宋 (the first ancestor’s wife), the twelfth-generation personal name and 廷/延 variants, the first son on page 18, two names on page 21, the traveler in the Wenxian/Yanchun entry, Shangda’s career attribution, and later handwritten spouse details. Source contradictions in early death years and lifespans remain documented locally. Further work should compare the Shunde Library genealogy and relevant archival records before resolving these.
