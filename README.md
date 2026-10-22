# STURN Distribution — Redesign Release 1.0

A responsive, static-first redesign for STURN Distribution, an Australian-focused immersion-cooling technology and distribution business in development.

## Included
- Rebuilt homepage with clear navigation and commercial positioning.
- Conceptual immersion tank illustration and single-phase / two-phase comparison.
- Interactive, keyboard-operable system-layer explorer.
- Illustrative monitoring dashboard with selectable chart metrics; all readings are demo data.
- Introductory knowledge-centre cards, partner pathways, enquiry form and FAQs.
- Responsive mobile navigation, skip link, visible keyboard focus and reduced-motion support.
- Search/social metadata, SVG favicon and share-preview graphic.
- Existing lightweight Node HTTP server pattern and `/ready` health-check route.

## Important truth-in-advertising notes
The explorer and dashboard are conceptual. No live hardware, telemetry, supplier appointments, stock, product availability, certification or released SaaS is claimed. The contact form opens a `mailto:` draft and intentionally has no recipient configured. Confirm the official enquiry email before launch.

## Requirements and Render
- Node.js 20 or later.
- `npm install` (there are no runtime dependencies).
- `npm start`.
- Render health-check path: `/ready`.
- Keep the existing Render service on the `main` branch and Node runtime. No new service or paid API is needed.

## Local preview
Open PowerShell in this folder and run:

```powershell
npm start
```

Then visit http://localhost:3000. Press Ctrl+C in PowerShell to stop the server.

## Publishing
See `PUBLISH-REDESIGN.ps1` in the parent ZIP. The script backs up the existing website files, copies this release into the existing repository, runs syntax checks, creates a branch and pushes it. It does not merge to `main` automatically. Review and merge the pull request to trigger the existing Render deployment.
