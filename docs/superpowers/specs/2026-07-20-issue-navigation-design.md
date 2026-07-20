# Issue navigation

## Goal

Add quiet, predictable navigation between weekly issues at the bottom of each issue page.

## Pattern

Use the selected minimal text-link direction:

- A thin rule separates the navigation from the closing subscription section.
- Left: previous issue, when one exists.
- Right: next issue, when one exists.
- Links show issue number and issue title.
- The current newest issue keeps a muted, non-clickable “Issue 003 · Coming soon” placeholder so the reading sequence remains visible.

## Current states

- Issue 001: only a right-side link to Issue 002.
- Issue 002 / homepage: a left-side link to Issue 001, plus the muted Issue 003 placeholder.

## Behaviour

- All labels, titles, and status copy respond to the existing Chinese/English switch.
- The same two-column reading order is retained on mobile with compact type and spacing.
- Navigation uses normal links only; it adds no storage, network calls, or scripts.

## Validation

- Confirm the two links point to the correct issue pages.
- Confirm Issue 003 is not clickable until published.
- Confirm Chinese and English states on both issue pages.
