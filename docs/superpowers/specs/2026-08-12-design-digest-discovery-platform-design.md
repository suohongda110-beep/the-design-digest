# The Design Digest discovery platform

## Purpose

Replace the magazine-first site with a bilingual, searchable design-resource discovery platform. The subject is a curated collection of tools, references, articles, and experiments for Chinese-speaking designers. Its single primary job is to help a visitor find a relevant resource quickly, then leave with a useful external link.

Existing issues 001–005 and their real images remain the source content. “Issue” becomes provenance and archive context, not the homepage’s central structure.

## Approved direction

The experience takes its interaction and density cues from NameThatUI, without reproducing its name, copy, brand assets, or page structure:

- A compact product-like visual dictionary rather than an editorial magazine.
- A centered, narrow content column; sticky translucent header; soft panels; thin low-contrast borders; modest rounded corners.
- Search is the first primary action. It filters real collected entries from natural-language terms and tags.
- Discovery cards are compact and information-rich: real thumbnail, tag, issue / item number, title, short description, and external source link.
- Blue is the single interactive accent; amber is reserved for recency/status. No fluorescent green or high-impact poster typography.

## Design tokens

### Dark theme

- `--bg`: `#101112`
- `--surface`: `#17191b`
- `--surface-raised`: `#1d2023`
- `--text`: `#f3f3f0`
- `--muted`: `#a9adb1`
- `--border`: `#2d3034`
- `--accent`: `#78a9ff`
- `--status`: `#f5a548`

### Light theme

- `--bg`: `#f8f8f6`
- `--surface`: `#ffffff`
- `--surface-raised`: `#f1f3f5`
- `--text`: `#202124`
- `--muted`: `#646a73`
- `--border`: `#dde1e5`
- `--accent`: `#2563c9`
- `--status`: `#b86608`

Typography uses a system sans stack with a dedicated monospace stack for counts, taxonomy, dates, and shortcut labels. Cards use 10–12px utility text, 16–18px titles, and 12–14px descriptions. The hero stays under 56px on desktop.

## Information architecture

### Global header

- Brand link returns to the discovery homepage.
- Navigation: `Explore / 探索`, `Topics / 主题`, `Archive / 往期`, `About / 关于`.
- Independent language control toggles Chinese and English.
- Theme control opens explicit choices: light, dark, system. It stores the choice locally; “system” responds to OS changes. Default is system.

### Homepage

1. Compact announcement/status strip for the newest issue.
2. Centered search hero with rotating example queries.
3. Search input opens on Cmd/Ctrl+K and filters by Chinese/English title, description, source name, topic, issue, and tags.
4. Topic filter chips and newest/issue sorting.
5. Responsive resource-card grid using real current images. Clicking the card opens the source link; links are keyboard accessible and clearly labelled.
6. “Load more” reveals additional currently filtered entries without a network dependency.

### Topics

Topic pages retain the shared controls and show only a selected taxonomy. Tags are normalized from existing content rather than invented labels.

### Archive

Archive lists issues 001–005 chronologically, newest first. Every item links to the corresponding issue page. It must include Issue 005.

### Issue pages

Issue pages remain directly accessible and preserve all ten entries with real images. Their list layout becomes one coherent card/list component on all entries; there may not be a missing metadata column that causes text to collapse. Previous/next navigation uses existing issue pages when present and only shows “coming soon” for an actually absent issue.

## Data and implementation boundaries

- Create a shared `digest-data.js` as the single client-side data source for all 50 entries. Each record has stable id, issue, position, source name, source URL, image path, zh/en title, zh/en description, and normalized tags.
- Build homepage and topics with this data module; retain static HTML pages for predictable GitHub Pages deployment.
- Extend `lang.js` so language selection works on both old and new page structures. It must store language choice and set `lang` on the document.
- Add a small `theme.js` that owns only theme storage, system preference detection, menu rendering, and accessible state; never mix it with content filtering.
- Add a focused `explore.js` that owns search, filters, keyboard shortcut, card rendering, result count, and empty state.
- Keep all links relative so deployment works at `https://suohongda110-beep.github.io/the-design-digest/` without changes.

## Interaction and accessibility

- Visible focus rings use `--accent`; all controls work by keyboard.
- Search filtering announces result changes through a polite live region.
- Empty results state explains that no matching resource was found and suggests clearing filters.
- Images have meaningful alt text using source/title.
- Respect `prefers-reduced-motion`; placeholder rotation and hover motion stop or become instant.
- Theme and language controls expose selected states with appropriate ARIA semantics.

## Responsive rules

- Desktop content max width is 1024px.
- Resource grid: two columns at 700px and above; one column below.
- Header retains brand, language, and theme controls on small screens; less essential nav labels may condense behind a menu only if needed.
- Card media remains fixed-proportion and never distorts existing source images.

## Acceptance checks

1. Homepage works in Chinese and English and renders all translated UI labels correctly.
2. Theme menu has light/dark/system choices, persists a selection, and system mode responds to OS preference.
3. Search and each filter return matching records; Cmd/Ctrl+K focuses search; no-result behavior is clear.
4. Every homepage thumbnail resolves to a real existing asset and links to the correct source URL.
5. Archive includes Issues 001–005, and previous/next links point to real neighboring issues.
6. Issue 005 card layout remains coherent for all ten cards at desktop and mobile widths.
7. Visual QA passes in dark and light themes at desktop and mobile widths with no clipped titles, collapsed metadata, missing images, or broken controls.
8. The GitHub Pages deploy succeeds and the live page is checked after publish.

## Explicit non-goals

- User accounts, bookmarks, newsletter back end, server-side search, and a CMS are out of scope.
- No changes are made to Feishu content in this redesign.
- The Netlify site is not used as deployment authority; GitHub Pages remains the free production delivery path.
