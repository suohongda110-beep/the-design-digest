# Subscription coming-soon state

## Goal

Make it clear that subscriptions are planned but not yet available, without sending visitors to an inactive email address or implying that sign-up works.

## Scope

- Replace every site-header subscription link with a non-navigating, visually muted coming-soon label.
- Replace the Issue 001 closing call-to-action with a non-navigating coming-soon button and a short explanatory message.
- Keep Chinese and English content fully controlled by the existing language switcher.

## Interaction

- Header: `订阅 · 即将开放` / `Subscribe · Coming soon`. It is presented as status text, not a link.
- Closing area: `订阅功能开发中` / `Subscriptions coming soon`. Selecting it reveals or focuses the matching explanatory message: `订阅系统正在准备中，敬请期待。` / `We’re preparing subscriptions. Please check back soon.`
- No email addresses, collection forms, storage, or network requests are introduced.

## Files and validation

- Update the four public pages: `index.html`, `archive.html`, `topics.html`, and `about.html`.
- Add only the minimal shared CSS and JavaScript necessary for the status treatment.
- Confirm the site has no remaining `hello@example.com` subscription links and verify both language modes on the home page and a secondary page.
