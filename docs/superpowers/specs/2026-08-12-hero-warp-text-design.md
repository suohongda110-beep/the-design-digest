# Hero WarpText design

## Goal

Replace the recently added hero title tilt with the supplied React Bits `WarpText` visual behavior. Preserve the existing static-site architecture, bilingual interface, theme choices, accessibility, and fast fallback rendering.

## Architecture

The supplied component is React code backed by `ogl`, while this site is plain HTML, CSS, and JavaScript with no application bundler. The effect will therefore be ported to a standalone native WebGL 2 module instead of introducing React.

The port keeps the supplied vertex shader, fragment shader, canvas text rasterization, pointer lensing, ambient distortion, refraction, visibility pausing, resize handling, and context-loss handling. The small `ogl` abstractions will be replaced with direct WebGL 2 setup for one full-screen triangle, one text texture, and the required uniforms.

## Title structure and fallback

The homepage keeps a real HTML `h1` containing the current Chinese and English headline. That text is the accessible source of truth and is visible immediately before JavaScript runs.

When WebGL initializes successfully, an `aria-hidden` canvas is added over the title and the visual HTML copy becomes transparent while remaining in layout. If WebGL initialization, shader compilation, texture creation, or font rasterization fails, the canvas is removed and the normal HTML title stays visible.

The previous `.hero-title-tilt`, glare layer, tilt custom properties, and pointer handlers will be removed completely so the two interaction systems cannot overlap.

## Content and theme synchronization

- Chinese texture: `这个设计资源，\n应该叫什么？`
- English texture: `What design resource\nare you looking for?`
- Font family and weight are read from the computed HTML title style.
- Text color is read from `--ink`; the final question mark retains `--accent` only in the HTML fallback because the supplied WarpText texture accepts one fill color.
- Language changes trigger a fresh text rasterization.
- Light, dark, and system theme changes trigger a fresh color rasterization.
- Resize and font readiness trigger a fresh size-aware rasterization.

## Motion parameters

The supplied defaults are the baseline:

- Warp strength: `0.08`
- Warp scale: `1.7`
- Speed: `0.55`
- Pointer influence: `0.42`
- Pointer strength: `0.38`
- Refraction: `0.018`
- Ripple: enabled

The title canvas height follows the existing hero title rather than the example's `320px`, so the homepage layout does not become taller.

## Input and performance

- Pointer interaction is enabled for mouse and pen, not touch.
- Native page scrolling remains untouched.
- Rendering pauses when the title leaves the viewport or the page becomes hidden.
- Device pixel ratio is capped at `2`.
- The animation loop owns one canvas and is cleaned up on teardown.
- No third-party runtime or network dependency is added.

## Reduced motion

When `prefers-reduced-motion: reduce` is active, ambient time-based warping stops. The text remains readable and only a reduced pointer response is allowed on fine-pointer devices. If WebGL is unavailable, the static HTML fallback remains unchanged.

## Verification

- Confirm the old tilt and glare implementation no longer exists.
- Confirm Chinese and English titles rasterize correctly without clipping.
- Confirm light, dark, and system themes update the texture color.
- Confirm pointer movement bends the title and pointer leave relaxes the effect.
- Confirm touch scrolling is not blocked.
- Confirm reduced-motion mode stops ambient movement.
- Confirm the HTML title remains readable when WebGL is deliberately disabled.
- Confirm no site-generated console errors occur.

