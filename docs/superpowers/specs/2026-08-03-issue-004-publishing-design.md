# Issue 004 publishing design

## Scope

Publish the ten records currently in the Feishu `D-四期收集` group as Issue 004 of The Design Digest.

## Content and media

- Use the existing resource titles, descriptions, tags, links, and original Feishu attachments.
- Store each attachment as a local static image under `outputs/design-digest/images/issue-004/`.
- Preserve the Issue 003 card order from the Feishu group order.

## Site behavior

- Create `issue-004.html` using the existing digest layout.
- Make `index.html` display Issue 004.
- Add Issue 004 at the top of `archive.html`.
- Change Issue 003's next-issue navigation from its placeholder state to a link to Issue 004.
- Keep issues 001–003 available in the archive.

## Publishing state

- After the website deploy completes, update the ten Feishu records to `已发布` and group `D-四期`.

## Verification

- Confirm every Issue 004 card has its source link and a loadable image.
- Confirm the homepage and archive expose Issue 004.
- Confirm the production site returns Issue 004 and at least one published image with HTTP 200.
