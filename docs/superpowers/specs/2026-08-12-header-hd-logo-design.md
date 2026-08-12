# Header HD logo design

## Goal

Add Suo Hongda's personal HD monogram from Figma to the Design Digest website without weakening the site's name recognition or competing with the homepage WarpText headline.

## Source of truth

- Figma file: `6QQN3UYItfMFtQLrzDdYMh`
- Node: `2:5`
- Source frame: `934 × 934`
- Visual construction: two white rectangular strokes form the left-side H through negative space; one white half-round shape forms the right-side D; all three shapes sit on a black square field.

The implementation uses an exact asset exported from the Figma node. It must not redraw, reinterpret, crop, outline, or remove the black field from the mark.

## Placement

Place the logo at the far left of the header brand link on every site page, immediately before the existing `design digest` wordmark.

- Display size: `28 × 28px`
- Gap between logo and wordmark: `9px`
- Alignment: vertically centered within the existing `56px` header
- The combined logo and wordmark remain one link to the homepage
- The wordmark stays visible at desktop and mobile widths

The logo does not appear beside the homepage hero title. WarpText remains the homepage's single large visual gesture, while the HD mark acts as persistent identity and navigation.

## Asset handling

Download the exact Figma export promptly and store it in the site's local assets directory because Figma asset URLs expire. Prefer SVG when the node export provides a faithful vector; otherwise use the exact PNG export at sufficient resolution.

Set explicit width and height on both the asset container and image. Use `object-fit: contain`; do not apply masks, filters, rounded corners, theme recoloring, or background replacement.

## Accessibility

The visible `design digest` wordmark already names the homepage link, so the logo image is decorative and uses an empty alt attribute. The link's accessible name remains the wordmark rather than redundantly announcing both an initialism and the site name.

## Verification

- Confirm the exported asset exactly matches Figma node `2:5`.
- Confirm the H and D negative-space construction is fully visible at `28px`.
- Confirm the logo and wordmark are one homepage link.
- Confirm the brand stays vertically centered in desktop and mobile headers.
- Confirm light and dark themes do not alter the black field or white mark.
- Confirm no header wrapping, clipping, or navigation collision occurs.

