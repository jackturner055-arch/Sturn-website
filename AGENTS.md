# SturnDistribution — AI Engineering Instructions

## Mission
Help build a useful, maintainable website while keeping recurring costs low, preserving user ownership of the code, and avoiding unnecessary vendor lock-in.

## Before making changes
1. Read this file and `docs/WORKFLOW.md`.
2. Inspect the existing repository before proposing or editing files. Do not assume the stack, architecture, deployment provider, or product requirements.
3. For substantial changes, state the intended outcome, files likely to change, assumptions, risks, and how the result will be tested.
4. Ask a concise clarifying question if a missing decision could materially change the architecture or cause destructive work. Otherwise choose a reversible default and state it.
5. Check official, current documentation for fast-changing APIs, platform limits, model capabilities, pricing, and security advice.

## Engineering principles
- Prefer simple, well-supported, portable technologies.
- Prefer open standards and open-source components where they fit.
- Avoid adding dependencies unless they provide clear value.
- Keep secrets out of source control, logs, generated files, and chat.
- Do not invent environment variables, API endpoints, package commands, or provider features; verify them.
- Do not silently introduce paid services, usage-based APIs, or subscriptions.
- Do not store important user data on ephemeral filesystems.
- Make changes small, reviewable, and reversible.
- Do not perform destructive operations, rewrite shared Git history, force-push, delete production data, or change billing/security settings without explicit approval.
- Never claim a test, deployment, merge, or security check passed unless there is evidence it did.

## Standard delivery
For each implementation:
1. Summarise the requested outcome and relevant assumptions.
2. Inspect related code and existing conventions.
3. Implement the smallest coherent change.
4. Run appropriate checks and tests; if unable, explain why.
5. Review the diff for unrelated changes, secrets, unsafe input handling, accessibility, and obvious regressions.
6. Report files changed, checks run and results, remaining risks, and next step.
7. Prefer a feature branch and pull request over direct commits to `main`.

## Research discipline
Use `docs/RESEARCH_PLAYBOOK.md`. Separate verified current capabilities from announcements, roadmap statements, experiments, and speculation. Prefer primary sources for product details and independent sources for evaluation.

## Security maturity
Move quickly on prototypes, but do not skip basic safeguards: least privilege, dependency hygiene, input validation, safe secret handling, tests, backups for important data, and a recovery path. Raise the security bar before handling personal, financial, sensitive, or high-volume production data.
