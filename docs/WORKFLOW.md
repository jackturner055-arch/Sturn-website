# Development Workflow

## Source of truth
GitHub is the canonical copy of source code and project instructions. Keep useful decisions in repository docs so they survive across chat sessions and AI tools.

## Normal change lifecycle
1. **Specify** — describe the user-visible outcome and acceptance criteria.
2. **Inspect** — review the repository and identify affected components.
3. **Plan** — choose a small implementation and identify risks.
4. **Implement** — make the change on a dedicated branch.
5. **Verify** — run formatting, type checks, tests, build and/or security checks appropriate to the stack.
6. **Review** — inspect the complete diff; confirm no secrets, accidental files, or unrelated edits.
7. **Publish** — commit and push the branch; open a pull request.
8. **Merge** — merge only when checks pass and the change is understood.
9. **Deploy** — use a connected host and verify the live result.
10. **Record** — document meaningful architectural decisions and incidents.

## Initial safety baseline
- Protect `main` with a pull request and required checks once the repository has a working CI workflow.
- Use short, descriptive branch names, e.g. `feat/landing-page`, `fix/mobile-nav`, `chore/ci-checks`.
- Use clear commit messages, e.g. `feat: add landing page`.
- Prefer squash merges for a tidy history.
- Avoid force-pushes and history rewriting.
- Never commit secrets, `.env` files, credentials, private keys, real user data, or local build output.
- Do not merge a failing build merely to make the pipeline green.
- Keep a known-good revision and use provider rollback or Git revert when needed.

## Automation boundaries
PowerShell scripts may automate local Git steps and GitHub CLI operations. Authentication is handled by Git Credential Manager and `gh`; never embed credentials in scripts.
The bootstrap script is designed for an empty repository. Do not run it against a repository containing work or against a destination folder that already exists.
The publishing script creates a branch and pull request. Its optional `-Merge` switch attempts a normal squash merge; GitHub settings and required checks remain authoritative.

## Before selecting the application stack
Clarify:
- What problem the website solves and for whom.
- Whether it needs accounts, payments, uploads, AI, email, scheduled jobs, or private data.
- Expected traffic and data persistence needs.
- Accessibility, privacy, legal, and security requirements.
- Budget ceiling and tolerance for cold starts or usage limits.

Prefer a static-first or modular architecture only if it fits the requirements. Do not choose a framework solely because it is fashionable.
