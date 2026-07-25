# Personal Brand Hub · Ryan Tayler

The source of truth for Ryan's personal brand hub. The hub itself is a single page Claude artifact, usable on phone and desktop.

**Live hub:** https://claude.ai/code/artifact/e8a6bb56-f302-433c-91f7-ef4f02955453

## What the hub holds

- **Today.** The locked foundation and the current posting mix against targets.
- **Brand.** The locked visual system. Palette with copyable hex values, the Own, Build, Teach lanes, type roles, card build spec, signature rules.
- **Voice.** Voice constants, hard rules, the ban list, the LinkedIn and Personal post structures, tone by format.
- **Build.** The content builder. Topic mix, the proof picker, all nine formats with hooks, beats, proof, meat, and Waterfall cuts.
- **Library.** Locked bios and quotes with copy buttons, the gold standard posts, The CRAFT Method™ carousel, and the IP register.
- **Tracker.** Post logging with topic mix (75/20/5) and effort mix (70/20/10) tracking against targets.

## Layout

- `hub/index.html` · the built artifact page, fully self contained (fonts and images inlined).
- `hub/hub-template.html` · the page source with asset placeholders.
- `hub/data.json` · all hub content. Segments, gold standard posts, formats, slides, and baked tracker entries. Edit this to add approved posts or entries.
- `hub/assemble.py` · builds `index.html` from the template, data, and assets.
- `hub/assets/` · woff2 fonts (Anton, Inter, Caveat latin subsets) and compressed carousel slides.
- `assets/craft-carousel/` · full resolution CRAFT Method™ carousel PNGs.
- `docs/` · the brand guideline v1.0 and the video build sheet, the two source documents.

## Updating the hub

1. Edit `hub/data.json` (new approved post, new segment, new baked tracker entry) or `hub/hub-template.html` (layout or rule changes).
2. Run `python3 assemble.py` from the `hub` directory.
3. Republish `hub/index.html` to the existing artifact URL so every device sees the update.
4. Commit and push.

Tracker entries logged in the browser live on that device only. Export from the Tracker tab and merge the entries into `data.json` to make them permanent everywhere.

## Rules that never bend

Dark is canonical. One accent per piece. Anton for headers, Inter for body, Caveat once per section. The signature is ink only on clean grounds. No dashes in prose, no colon in prose unless it introduces a list, Australian spelling. Locked segments are reproduced exactly, never paraphrased.
