# Gaps to close before bot runs Wave 1

These are the values currently `TBD` in `applicant-profile.json` and `w8ben-draft.md`. The bot must **stop and prompt Maryna** if it hits any of them.

## Critical (block all 3 platforms)

- [ ] **Portuguese NIF** (9-digit tax ID, e.g. `123456789`) — required for W-8BEN line 6a and most EU forms. Source: her Portuguese ID card / Cartão de Cidadão, or any Autoridade Tributária document, or the AT portal at https://www.acesso.gov.pt/.
- [ ] **Lisbon street address + postal code** — required for W-8BEN line 3 and TELUS application.

## Important (block specific platforms)

- [ ] **Wise USD activation** — required *before* first DataAnnotation / Outlier payout. Maryna does this in the Wise app (~10 min). See "Wise USD activation" in `wave-1-runbook.md`.
- [ ] **Wise EUR IBAN + BIC** — for TELUS SEPA payout setup. Should already be in her Wise account; she just needs to copy.

## Nice-to-have (won't block, but the bot should ask Maryna to fill in if a form requests them)

- [ ] **Portuguese PR number** — sometimes asked on TELUS form.
- [ ] **Ukrainian passport number** — sometimes asked.
- [ ] **City of birth** — sometimes asked on tax / KYC forms.
- [ ] **Emergency contact** (name, phone, relationship) — TELUS asks at contract signing.

## Optional, but improves bot autonomy

- [ ] **Maryna's electronic signature** as an image — speeds up DocuSign / W-8BEN steps. She can take a photo of a hand-signed paper signature on white background and save it as `docs/applications/signature.png`.
- [ ] **Front and back of Portuguese PR card** as scans — for KYC steps. Save as `docs/applications/id-pr-front.jpg` / `id-pr-back.jpg`.

## How the bot resolves a gap mid-run

1. Bot detects a `TBD` it needs.
2. Posts a message to the tracker's notes for the relevant job: `"BLOCKED: needs <field>"`.
3. Optionally creates a "blocker" job entry with status `found` and platform `BLOCKER` so it surfaces visibly.
4. Stops processing that platform until Maryna replaces the `TBD` and re-runs the bot.

## Once gaps are closed

Maryna or Gourav edits `applicant-profile.json`, replacing each `"TBD"` with the real value. The bot reads fresh on every run, so no rebuild needed.
