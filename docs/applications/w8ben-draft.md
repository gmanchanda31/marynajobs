# W-8BEN — Draft for Maryna Bodnaryuk

This is a field-by-field draft of IRS Form **W-8BEN** (Certificate of Foreign Status of Beneficial Owner for U.S. Tax Withholding and Reporting). DataAnnotation, Outlier, Surge AI, and Mercor will all ask Maryna to complete this once she's accepted — they typically present it as an embedded form during onboarding.

The bot should pre-fill these values and pause for Maryna's signature.

> **Required gap before submission:** Maryna's Portuguese **NIF** (Número de Identificação Fiscal). Without it, the form is incomplete and the platform will withhold a higher rate (30% instead of the Portugal–US treaty rate of 0–10%).

---

## Part I — Identification of Beneficial Owner

| Line | Field | Value |
|---:|---|---|
| 1 | Name of individual who is the beneficial owner | **Maryna Bodnaryuk** |
| 2 | Country of citizenship | **Ukraine** |
| 3 | Permanent residence address (street, apt., city or town, state or province, postal code, country) | **TBD street and apt, Lisbon, [postal code TBD], Portugal** |
| 4 | Mailing address (if different from above) | *Same as line 3 — leave blank* |
| 5 | U.S. taxpayer identification number (SSN or ITIN), if required | *Leave blank — not applicable* |
| 6a | Foreign tax identifying number (FTIN) | **TBD — Maryna's Portuguese NIF (9 digits, no spaces)** |
| 6b | Check if FTIN not legally required | *Do not check — Portugal issues NIFs to residents* |
| 7 | Reference number(s) | *Leave blank* |
| 8 | Date of birth (MM-DD-YYYY) | **02-23-1999** |

## Part II — Claim of Tax Treaty Benefits

| Line | Field | Value |
|---:|---|---|
| 9 | I certify that the beneficial owner is a resident of ____ within the meaning of the income tax treaty between the United States and that country. | **Portugal** |
| 10 | Special rates and conditions | *Leave blank — standard treaty rates apply for individuals* |

> **Treaty note:** Under the U.S.–Portugal income tax treaty (Article 14 / "Independent Personal Services"), self-employment income earned by a Portuguese tax resident from a U.S. payer is generally **not** subject to U.S. withholding when the recipient does not have a fixed base in the U.S. Maryna's situation matches — she works remotely from Lisbon. Withholding should be **0%**.

## Part III — Certification

> I certify that I have examined the information on this form and to the best of my knowledge and belief it is true, correct, and complete. I further certify under penalties of perjury that:
> - I am the individual that is the beneficial owner of all the income to which this form relates...
> - The person named on line 1 of this form is not a U.S. person,
> - This form relates to: (a) income not effectively connected with the conduct of a trade or business in the United States,
> - The person named on line 1 of this form is a resident of the treaty country listed on line 9 of the form (if any) within the meaning of the income tax treaty between the United States and that country, and
> - For broker transactions or barter exchanges, the beneficial owner is an exempt foreign person as defined in the instructions.

| Field | Value |
|---|---|
| Sign Here (signature of beneficial owner) | **Maryna Bodnaryuk** (handwritten or typed e-signature) |
| Print name of signer | **Maryna Bodnaryuk** |
| Date (MM-DD-YYYY) | *Date of signing — bot inserts at submission time* |
| Capacity in which acting | *Leave blank — applies only to representatives, not the individual themselves* |

---

## Things Maryna must verify herself

- [ ] Confirm her Portuguese NIF is correct (find it on her Portuguese ID card / "Cartão de Cidadão" or any AT — Autoridade Tributária — document)
- [ ] Confirm her current Lisbon street address and postal code
- [ ] Sign electronically when the platform presents the form
- [ ] Save a PDF copy of each signed W-8BEN — she'll need to refile every 3 years and for each new platform

## Bot operating instructions

When the bot encounters a W-8BEN form on a platform:

1. Pull values from this document, substituting `TBD` with values fetched from `applicant-profile.json` (which Maryna will fill in for `address.street`, `address.postal_code`, `tax.ftin_pt_nif`).
2. If any of those three values are still `TBD`, the bot **must pause** and prompt Maryna in chat or via the tracker, rather than guess.
3. After Maryna signs, the bot uploads the signed PDF to the platform and marks `tax.us_w8ben_status = "submitted"` in `applicant-profile.json` (or notes per-platform if status differs).

## Source

IRS Form W-8BEN (October 2021 revision): https://www.irs.gov/pub/irs-pdf/fw8ben.pdf
Instructions: https://www.irs.gov/pub/irs-pdf/iw8ben.pdf
