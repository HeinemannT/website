# Landing page

The public landing page is the lake-to-city drawing and its interactive collapse.
This release has no visible text, building labels or profile overlay. The gallery,
Gedanken and Ich destinations are inactive until real content is available.

Run `npm test` to build and validate the landing page. Run `npm run dev` to serve
the generated output locally on port 5189. No dependencies need installing.

The Pages workflow publishes only `dist/index.html`, the lake and scene assets,
and the Satoshi webfonts. Reading-page drafts are deliberately excluded from the
public artifact. The two existing applications keep their own build steps and
paths. Root favicon, manifest, robots and custom-domain files are preserved.

The editable source of the landing page is here; the old root-level index and
its artwork are retained for reference but are no longer used by deployment.
