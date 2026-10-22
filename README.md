# STURN Distribution — Website v0.1

A responsive, static-first public website for STURN Distribution, an Australian-focused immersion-cooling technology and distribution business in development.

## What this release includes
- Responsive dark technical visual design and mobile navigation.
- Sections covering immersion cooling, components, planned connected monitoring, partnerships, company context, enquiries and FAQs.
- Accessible focus styles, skip link and reduced-motion support.
- Static assets and simple Node.js server for the existing Render Web Service configuration.
- `/ready` health-check endpoint.
- No database, frontend framework, paid runtime library, or AI API dependency.

## Important product limitations
- The enquiry form opens an email draft in the visitor's email application. It does not submit to a server or store data. The email recipient is intentionally not configured; confirm the official enquiry email before launch.
- Content intentionally avoids claiming confirmed suppliers, inventory, certifications, customers or a released monitoring platform.
- Confirm company/legal details, privacy wording, contact details and domain before public promotion.
- Google Fonts are loaded externally; the system font fallbacks remain available if the service is blocked.

## Render configuration
The Render service shown in the setup screenshots is a Node Web Service with:
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/ready`
- Branch: `main`
- Auto-deploy: On Commit

This repository includes `package.json` and `server.js` to match those commands. The server uses Render's `PORT` environment variable and listens on `0.0.0.0`. No environment variables or secrets are required for the initial website.

## Local preview
Install Node.js 20 or later, then from this directory run:
```powershell
npm start
```
Open `http://localhost:3000`.

## Workflow
Read `AGENTS.md` and `docs/WORKFLOW.md`. Keep changes small and reviewable, test before merging, and never commit credentials or `.env` files.
