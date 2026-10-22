# Research Playbook — SIFT Plus Evidence

## Goal
Reduce the risk of decisions based on marketing, stale tutorials, copied claims, hype, or incomplete knowledge.

## Research procedure
1. **Define the decision.** Write down the question, constraints, date sensitivity, and evidence that would change the choice.
2. **Search deliberately.** Use alternative terms, exact phrases, date filters, domain restrictions, and relevant technical documentation indexes.
3. **Read laterally.** Investigate the author, publisher, incentives, funding, track record, and independent coverage rather than trusting the source's self-description.
4. **Trace upstream.** Find the original documentation, changelog, source code, paper, benchmark, policy, or pricing page behind a claim.
5. **Cross-check.** Seek independent evidence. Three articles repeating the same press release are not three independent confirmations.
6. **Check applicability.** Confirm release status, region, account tier, date, prerequisites, limitations, and whether the feature is available to our project.
7. **Try to falsify.** Search for known failure modes, critical reviews, competing benchmarks, migration costs, and counterexamples.
8. **Record the conclusion.** Include date checked, sources, trade-offs, confidence, unresolved questions, and a condition that would cause us to revisit it.

## Source hierarchy (context-dependent)
- Primary: official documentation, release notes, API references, source code, standards, research papers, published methodology and pricing pages.
- Independent expert analysis: reputable technical publications, security researchers, maintainers, and practitioners who disclose methodology.
- Community evidence: issue trackers, discussions, forums, and user reports; useful for failure modes but not definitive alone.
- Marketing, anonymous claims, unsourced social posts and AI-generated summaries: discovery leads, not sufficient proof by themselves.

Primary sources can be authoritative about what a vendor says its product does, but independent evidence is often better for evaluating quality, reliability, lock-in, and real-world trade-offs.

## Label claims
- **Available now** — verifiable and accessible under the relevant terms.
- **Limited preview / experiment** — available only to selected users, regions, tiers, or unstable APIs.
- **Announced / planned** — publicly announced but not generally available.
- **Forecast / hypothesis** — plausible, but not a confirmed capability.
- **Unknown** — insufficient evidence; identify a practical way to investigate.

## AI and technology trend research
For important emerging capabilities, investigate:
- model capabilities and reproducible evaluations;
- agent reliability, tool-use boundaries, human approvals and audit logs;
- inference costs, latency, rate limits and data handling;
- open models, open agent harnesses, interoperability standards and MCP;
- deployment, databases, storage, authentication and vendor portability;
- software supply-chain security, dependency provenance and secret management;
- migration costs, platform terms, and credible alternatives.

Never infer that a benchmark result guarantees performance in our own application. Test representative tasks before committing architecture or budget.
