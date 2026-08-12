# Hero title tilt design

## Goal

Give the homepage hero headline one memorable, tactile interaction without bringing the glow-heavy card treatment back into the resource catalog. The headline remains readable and visually dominant; motion is a reward for pointer exploration, not required feedback.

## Chosen direction

Use a fixed, flat hit area around the existing headline and transform only an inner title layer. On fine-pointer desktop devices, pointer position drives a restrained 3D tilt capped at `3deg` on each axis. The title follows with a short eased transition and returns to rest slowly after pointer leave.

A broad, low-opacity white highlight tracks the pointer inside the title surface. Its maximum opacity is `0.08` in light mode and `0.11` in dark mode. The highlight must read as a change in material, not a luminous spotlight.

## Interaction rules

- Apply the effect only to the homepage hero headline.
- Keep the outer hit area untransformed so pointer tracking does not flicker at transformed edges.
- Do not use `touch-action: none`; touch scrolling must remain native.
- Enable pointer tracking only for `(hover: hover) and (pointer: fine)`.
- Reset all transform and highlight properties on pointer leave.
- Disable transforms and transitions when `prefers-reduced-motion: reduce` is active.
- Preserve the existing Chinese and English headline markup and language switching.

## Structure

The existing `.discover-hero h1` becomes the flat hit area. Its current text contents are wrapped in an inner `.hero-title-tilt` element. A decorative `.hero-title-glare` layer sits inside that inner element and is hidden from assistive technology.

The motion script binds once on page load, writes `--title-rx`, `--title-ry`, `--title-gx`, and `--title-gy`, and toggles `is-tilting` and `is-hover` classes. No external dependency is added.

## Visual parameters

- Perspective: `1000px`
- Maximum rotation: `3deg`
- Follow duration: `180ms`
- Return duration: `850ms`
- Glare fade: `260ms`
- Glare opacity: `0.08` in light mode and `0.11` in dark mode

## Verification

- Confirm the headline follows pointer position without edge jitter.
- Confirm leaving the title returns it to a flat state.
- Confirm no effect runs on touch/coarse-pointer layouts.
- Confirm reduced-motion mode removes transforms and transitions.
- Confirm Chinese/English switching and light/dark/system themes still work.
- Confirm the browser console contains no site-generated errors.
