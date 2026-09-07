# Genealogy Viewer

This viewer preserves photographs of a Lao family manuscript alongside a Chinese transcription, an English translation, a family tree, and an event map. It is made with React, Vite, and Tailwind CSS; human-readable YAML files supply the content.

The transcription and translation originated with AI assistance and human review. The September 2026 editorial pass corrected selected passages against the photographs. It is not a complete scholarly transcription. Difficult characters, uncertain relationships, and contradictions in the manuscript are labeled rather than silently harmonized.

## Using the viewer

Read the photograph alongside the Chinese and English columns. Names and dates may cross column and page boundaries. Open a note to distinguish a manuscript statement from editorial inference or regional context. Follow cited sources for the supporting evidence and research leads.

The map shows recorded **events and places**, including property, offices, graves, and travel. Dated events enter playback according to their stated precision. Undated events remain available in the event list and on the map when their general locations are known. Unresolved places appear in the list without invented coordinates. No traveled route is established by the current evidence.

The tree uses a single record for each identified person. Lines follow natural descent; adoption is labeled and linked to the same person. An adopted person with an unrecorded natural parent is displayed under the adoptive parent with that relationship stated. A branch ending on screen does not establish childlessness. Unnamed children and uncertain readings are explicitly marked.

## Editorial record

The [change record](./editorial-changes.json) preserves prior and corrected text with stable page and column references. Source photographs and their alignment are unchanged. The [reading guide and research leads](./glossary.md) describe naming, calendars, offices, property, and the outstanding archival work.

Confirmed corrections include the twenty-first-generation cover, Lady Deng’s 1672 birth, Ren/任, Huiding/輝鼎, Wenyao/文曜, Shangda/上達, Yongzhao/永兆, Guozhi’s 1906 death, and the final Queenstown burial passage. Important unresolved issues include the early age/date contradictions, the twelfth-generation personal-name reading, attribution of the career listed under Shangda, the traveler in the Wenxian/Yanchun entry, and later handwritten spouse details.

## Data and dates

- `data.yaml`: manuscript pages, notes, event evidence and map points. Stable column IDs also preserve intentionally blank columns.
- `family_tree.yaml`: unique identities, natural children, adopted children, alternate identity information and uncertainties.
- `smart-text-glossary.yaml`: concise explanations for terms in the translation.
- `editorial-changes.json`: the original and revised readings from this editorial pass.

An exact Western day is displayed only when explicitly recorded or independently checked. Otherwise the original calendar expression, year, inferred range, or unknown date is shown. Old machine-generated conversions are unverified legacy metadata and must not be treated as authoritative. Reign years refer to lunisolar years and can overlap two Western years.

Made by **Tassilo Heinemann**. Questions or corrections: tassilodheinemann@gmail.com
