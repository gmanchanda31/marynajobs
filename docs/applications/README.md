# Wave 1 Application Bundle

Everything the local AI bot needs to apply to the three Tier-1 platforms on Maryna's behalf, plus the deliverables for Maryna herself (W-8BEN draft, writing samples).

## Files

| File | Purpose | Audience |
|---|---|---|
| `applicant-profile.json` | Single source of truth — all the data the bot fills into forms. | Bot |
| `wave-1-runbook.md` | Step-by-step per-platform instructions, including stop conditions. | Bot + human reviewer |
| `w8ben-draft.md` | IRS Form W-8BEN field-by-field draft. | Maryna (signs) + Bot (pre-fills) |
| `writing-sample-1.md` | Customer-facing polite-refusal sample. | Maryna (adapts and submits) |
| `writing-sample-2.md` | Plain-English explainer (workforce shrinkage). | Maryna (adapts and submits) |
| `gaps.md` | What's still missing — bot stops and prompts when it hits these. | Maryna |

## Wave 1 platforms (in apply order)

1. **DataAnnotation.tech** — fastest acceptance, ~$20–40/hr USD via Wise
2. **Outlier (Scale AI), EU PT pool** — highest demand for native European Portuguese, $15–30/hr USD via Wise
3. **TELUS Digital — Personalized Internet Ads Evaluator (Portugal)** — anchor income €9–14/hr via SEPA

## Before the bot runs

- [ ] Maryna fills the `TBD` fields in `applicant-profile.json` and `w8ben-draft.md` (see `gaps.md`)
- [ ] Maryna activates USD on her Wise account
- [ ] Maryna reads `writing-sample-1.md` and `writing-sample-2.md` and is ready to adapt them when prompted
- [ ] Bot has read access to `applicant-profile.json` and write access to the tracker API (`BOT_TOKEN` set)

## How progress shows up

Each application updates the tracker (https://marynajobs.vercel.app) via `PATCH /api/jobs/<id>`. Maryna sees the pipeline move:

```
Found  →  Applied  →  In Test  →  Active
                              ↓
                          Closed (if rejected or declined)
```

She doesn't need to know the bot exists — just that the dashboard reflects reality.
