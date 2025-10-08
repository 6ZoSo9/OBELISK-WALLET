VOID / Obelisk — Legal Docs Pack
Generated: 2025-10-07

Place these files into BOTH repositories (OBELISK-WALLET and VOID-CHAIN).
Suggested locations:
- LICENSE, NOTICE at repo root
- docs/legal/* (keep all the rest in a 'docs/legal' folder)

Files:
- LICENSE (VCL v1.0)            — Source-available license prohibiting forks/redistribution/commercial use.
- CLA.md                         — Contributor License Agreement.
- GOVERNANCE.md                  — BDFL model (ZoSo final say).
- TRADEMARKS.md                  — Trademark policy & usage rules.
- TERMS_OF_USE.md                — Terms for using the repos and binaries.
- EULA.md                        — End-User License for distributed binaries.
- PRIVACY.md                     — Privacy policy (no telemetry by default; update if you add analytics).
- SECURITY.md                    — Security policy (vuln reporting).
- DMCA_POLICY.md                 — DMCA takedown process template.
- THIRD_PARTY_NOTICES.md         — Attributions for dependencies (fill as needed).
- NOTICE                         — Copyright + project notice.
- LEGAL.md                       — Central index pointing to all of the above.

How to apply (example):
  # at repo root
  cp LICENSE NOTICE .
  mkdir -p docs/legal
  cp docs_legal/* docs/legal/

Then commit:
  git add LICENSE NOTICE docs/legal
  git commit -m "legal: add license, terms, trademarks, privacy, DMCA, security"
  git push

