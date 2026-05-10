# Wave 1 Application Runbook

Three platforms, in this order. Each section tells the local AI bot exactly what to do, what data to pull from `applicant-profile.json`, and where to **stop** and hand off to Maryna.

> **Bot operating principles**
> - Do not invent answers for `TBD` fields. Stop and prompt instead.
> - Do not attempt qualification tests, video interviews, or ID verification (selfie/passport scan). Schedule them for Maryna and stop.
> - After every successful step, write status to the tracker via `PATCH /api/jobs/<id>` with the matching status (`applied`, `in_test`, etc.) and append a one-line note.
> - Save every confirmation email screenshot / PDF to `docs/applications/evidence/<platform>/`.

---

## 1. DataAnnotation.tech

**Tracker job ID:** find via `GET /api/jobs` filtered by `platform = "DataAnnotation.tech"` (seeded as `tier1`, currently `found`).
**Why first:** highest acceptance rate, fastest turnaround (~48 hr decision), accepts multilingual writers.

### Step-by-step

1. Open https://www.dataannotation.tech/.
2. Click **Apply** (top-right).
3. Fill the application form using `applicant-profile.json`:
   - Email → `contact.email`
   - First name / Last name → `personal.first_name` / `personal.last_name`
   - Country → `address.country`
   - Phone → `contact.phone_primary.e164` (Ukrainian +380); if rejected, retry with `phone_secondary` (PT)
   - LinkedIn → `contact.linkedin`
   - Languages → list all four from `languages[]`
   - Highest education → "Some college (1 year)" — do not check Bachelor's
4. Writing prompt (~30–60 min, **bot must not auto-fill**): the platform shows a prompt similar to "respond to a customer asking for a refund outside policy" or "explain X in plain English". Mark the job as `in_test` in the tracker and notify Maryna with links to:
   - `docs/applications/writing-sample-1.md` (refund refusal)
   - `docs/applications/writing-sample-2.md` (shrinkage explainer)
5. Maryna submits the writing sample herself, adapting one of the two prepared samples to the actual prompt.
6. After acceptance email arrives (typically 24–72 hr): bot patches status to `active`, fills tax form using `w8ben-draft.md`, and sets up payout via Wise USD (see "Wise USD activation" below).

### Common pitfalls

- DataAnnotation rejects copy-paste-perfect samples — Maryna must add personal voice / specific examples.
- They check IP geolocation; Lisbon IP is fine. Do not use a US VPN.
- They pay via Stripe → Wise USD account number. **USD on Wise must be activated before the first payment cycle.**

### Stop conditions for the bot

- The writing test page → notify Maryna, mark `in_test`, stop.
- Tax form → fill from `w8ben-draft.md`; if NIF is `TBD`, prompt Maryna and stop.
- "Verify your identity" / selfie step → stop, notify Maryna.

---

## 2. Outlier (Scale AI) — European Portuguese pool

**Tracker job ID:** seeded as `tier1`, role "European Portuguese annotator pool".
**Why second:** highest demand for native EU PT specifically; pay tiers favour rare languages.

### Step-by-step

1. Open https://outlier.ai/.
2. Click **Apply** → choose **Sign up with email** (not LinkedIn — bot can't OAuth on Maryna's behalf without her present).
3. Use `contact.email` as the signup email. Verify the email link **only after Maryna confirms** (bot should pause for the verification click).
4. On the dashboard, navigate to **Projects** and filter for:
   - "Portuguese (Portugal)" or "European Portuguese"
   - "Multilingual" / "Translation QA" if any matching her PT/RU/UK
   - Avoid coding-only projects (she's tech-comfort B, not a coder)
5. For each matching project, click **Apply**:
   - CV upload → `docs/cv-modern.pdf` (designed version is fine; the ATS one if a parser is detected)
   - Profile fields → from `applicant-profile.json`
   - Native languages declaration → check Portuguese (Portugal), Ukrainian, Russian; English at C1
6. Outlier shows a **screening test** per project (~1–2 hr). Mark `in_test`, stop, notify Maryna with:
   - Test name
   - Estimated time
   - Direct link to take it
7. After Maryna passes: bot fills tax form (W-8BEN draft), confirms Wise USD account, marks `active`.

### Common pitfalls

- Outlier auto-rejects if you check "Bachelor's degree" without one. Education must be honest — "Some college" or equivalent.
- Their writing tests are often domain-flavoured (e.g. "respond to a customer-service prompt in European Portuguese"). The CS-refusal sample (`writing-sample-1.md`) translates well; Maryna should rewrite it in EU PT.
- US English vs EU English in instructions — Maryna should follow whatever the prompt uses, not switch.

### Stop conditions for the bot

- Email verification click → stop.
- LinkedIn OAuth dialog → stop, recommend signup-with-email instead.
- Screening test → stop, mark `in_test`.
- "Take a selfie" / ID step → stop.
- Tax form → fill from W-8BEN draft, pause if NIF is `TBD`.

---

## 3. TELUS Digital — Personalized Internet Ads Evaluator (Portugal pool)

**Tracker job ID:** seeded as `tier2`, role "Personalized Internet Ads Evaluator (Portugal)".
**Why third:** anchor income (€9–14/hr, steady part-time), low test bar, pays via SEPA so no Wise/W-8BEN friction.

### Step-by-step

1. Open https://www.telusdigital.com/careers/job-search.
2. Filter:
   - **Country:** Portugal
   - **Keyword:** "Internet Ads" OR "AI Community" OR "Search Quality"
3. Click into the matching job (typically titled "Personalized Internet Ads Evaluator – Portugal" or similar).
4. Click **Apply Now**. The form is hosted on TELUS's Workday-style ATS:
   - Personal info → from `applicant-profile.json`
   - Resume upload → `docs/cv-ats.pdf` (Workday parsers prefer ATS-clean layout)
   - Cover letter → use the `common_application_answers.why_this_role` field; tailor `why_this_company` to: *"TELUS Digital's evaluator program is a strong fit for native European Portuguese speakers, and the role's structured quality criteria match my workforce-management background."*
   - Languages → declare PT (native, EU), UA, RU, EN (C1)
   - Hours of availability → check 20 hrs/week (TELUS evaluator roles are part-time by policy)
   - Right-to-work in Portugal → Yes (`work_authorization.right_to_work_eu = true`)
5. After submission, TELUS sends an email with a link to the **"Tester for Hire"** assessment (~30 min). Mark `in_test`, notify Maryna.
6. Maryna takes the assessment herself.
7. After passing: TELUS sends contract via DocuSign; bot pauses for Maryna to sign.
8. Contract signed → mark `active`, payment via SEPA (no W-8BEN needed; TELUS pays through their EU entity).

### Common pitfalls

- TELUS rejects profiles with multiple country preferences set. Apply to **Portugal only** in this wave; we can add Ukraine pool as a separate Wave-1.5 job if Wave 1 stalls.
- Their assessment includes "rate this ad's relevance to this query" tasks. There's a published rater guidelines document; Maryna should skim it before the test (link will be in TELUS's onboarding email).
- They pay only after a 1-month "warm-up" period at reduced hours. Plan budget assuming first SEPA payout is ~6 weeks out.

### Stop conditions for the bot

- "Tester for Hire" assessment → stop.
- DocuSign contract → stop, prompt Maryna.
- Background check authorization → stop, prompt Maryna (she'll need to authorize a check on her PT residency).

---

## Status flow

For each job, the bot transitions the tracker through:

```
found → applied → in_test → active
                       ↓
                    closed (if Maryna fails the test or declines)
```

`PATCH /api/jobs/<id>` body example:

```json
{
  "status": "applied",
  "appliedAt": "2026-05-10",
  "url": "https://www.dataannotation.tech/apply",
  "notes": "Application submitted via bot. Email verification link forwarded to Maryna."
}
```

## Wise USD activation (one-time, before first USD payout)

The bot cannot do this — Wise requires Maryna's authenticated session.

1. Open the Wise app.
2. Tap **Balances** → **Add balance** → search **USD** → **Get account details**.
3. Wise issues a US routing number + account number — this is what Maryna pastes into DataAnnotation, Outlier, Surge AI payout settings.
4. Done. Takes ~10 minutes, no fee.

Add to checklist before Wave 1 acceptance emails arrive.

## Failure handling

If a step fails (form rejection, account locked, etc.):

1. Bot retries once after 5 minutes (could be a transient issue).
2. If the second try fails, mark the job's tracker status to `closed` with `notes` containing the error, and move to the next platform.
3. Do not retry beyond once. Pile-on retries trigger captcha and IP bans.
