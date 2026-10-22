# Technology Radar — Initial Baseline

**Research date:** 2026-10-23
**Status:** Initial orientation, not a final architecture decision. Recheck official pricing, limits and release status before implementation.

## Adopt / use as foundations
- **Git + GitHub:** source history, branches, pull requests and code review.
- **Repository-level agent instructions (`AGENTS.md`):** keep project context portable across tools.
- **Automated checks:** run checks on pull requests before merging.
- **PowerShell + Git + GitHub CLI:** a low-friction local workflow using the user's authenticated session rather than hard-coded tokens.

## Trial / likely candidates
- **Cloudflare Pages / Workers:** strong candidate for static hosting and lightweight server-side functions. Verify request, CPU, build and storage limits against the actual application.
- **Render:** useful for backend experiments and conventional web services; free instances can sleep, local filesystem data is ephemeral, and free Postgres is temporary.
- **Static-first frontend:** consider if the site is mostly content or client-side UI. Select the framework after requirements are known.
- **Managed database/authentication:** add only if product requirements justify it. Compare portability, backups, quotas, data region, security and migration effort.

## Watch
- **AI coding agents:** increasingly capable of repository-wide changes, tool use, test execution and PR workflows. Keep actions bounded and require evidence for claimed success.
- **MCP and interoperable tool interfaces:** can reduce bespoke integration work, but each server's permissions and trust boundaries need review.
- **Open agent harnesses and model choice:** potentially improve portability between models and environments; verify maturity and maintenance before depending on them.
- **Automated security and supply-chain checks:** valuable as the app matures; configure with least privilege and avoid blindly trusting unreviewed third-party workflow actions.

## Avoid for now
- Choosing a complex stack before defining the product.
- Adding paid AI API calls before establishing cost controls and a clear user benefit.
- Using a temporary free database for important persistent data.
- Tying core business logic tightly to one proprietary hosting provider.
- Autonomous production changes without review, tests, rollback and a clear audit trail.

## Revisit triggers
Re-evaluate the radar when the product requirements become clear, a free-tier limit is approached, a security issue emerges, a major platform changes its terms, or a new tool materially improves reliability or cost.

## Current first release
- Website: static HTML/CSS/JavaScript served by a small built-in Node.js HTTP server so it matches the existing Render Web Service's `npm install` / `npm start` settings.
- No framework or database is introduced until the product needs justify one.
- Enquiry form is currently mailto-only and is not a backend form submission.
