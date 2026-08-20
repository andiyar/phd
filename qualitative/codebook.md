# Paper 4 Codebook — v2 (theme framework)

Framework analysis codebook — DREAMS Trial qualitative study.

**v2 (23-Jul-2026):** restructured around four themes following the v3 research question
(DECISIONS D12), scope triage (D13), and theme sort (D14). Supersedes the five-domain /
47-subcode structure — v1 archived at `codebook_v1_archive_20260622.md`. Old sub-codes are
**retired from active coding**: they remain on existing rows as provenance (see Appendix A)
but are not assigned to new quotes.

**Theme labels are working labels** — BT-agreed 23-Jul-2026, pending supervisor lock
(next meeting 26-Aug-2026).

**Research question (v3):** *How does proportional sedation at the end of life with
dexmedetomidine or midazolam impact patient comfort, as explored through clinical
documentation and family comfort assessments?*

---

## Scope gate (apply before coding anything)

A quote enters the database only if it speaks to patient comfort, distress, or
rousability/communication under sedation. Out of scope (do not extract; D12/D13):

- Fine-grained symptom management (breakthrough dosing, pain scores, secretions,
  circulatory changes, etc.) **unless the symptom content feeds distress**
- Clinician→family counselling / information-exchange notes (prognosis updates,
  treatment explanations) — these document the family being informed, not the
  patient's comfort (D14, ids 89/219 precedent)
- Administrative, template, and checkbox content (unchanged from v1)

---

## The four themes

Each in-scope quote is assigned a **primary** theme. Where a quote genuinely spans two
themes, it may be cross-coded as two rows with cross-reference notes linking the paired
ids. Voice (staff/family) is a cross-cutting stream, not a theme — see below.

### 1 · Comfort through Preserved Awareness

> **Definition:** Patients are comfortable and able to express or show that comfort
> through interaction, awareness, responsiveness, or rousability. There is preservation
> of biographical life — the ability to make memories with families, staff, and others —
> wakefulness without inherent discomfort, interaction at the end of life, and the ability
> to connect.

Working notes (from the 22-Jul meeting, Judy's independent pass, and the 23-Jul sort):
- Comfort described **alongside** retained interaction, responsiveness, or connection —
  "calm but present", settling with reassurance, engagement with family
- Includes *Minimally responsive* observations where intermittent waking / flickers of
  spontaneous awareness are the comfort-relevant content (BT boundary call, 23-Jul: 3/3
  such quotes landed here, not in Theme 4)
- Highest direct-family voice of any theme (5/16 quotes are PCA forms) — families
  disproportionately document awareness-as-comfort
- Judy's label: "comfortable wakefulness" / "comfort through connection"

### 2 · Comfort through Deep Settling

> **Definition:** Patients have the external appearance of being comfortable, with minimal
> or no responsiveness — no appearance of pain, regulated breathing, looking settled and
> relaxed. There is no ability to ask or check; comfort is an external assumption.

Working notes (from the 22-Jul meeting, Judy's independent pass, and the 23-Jul sort):
- Comfort judged through **absence** — stillness, sleep, unresponsiveness framed as
  peaceful ("appears settled and sleeping", "no rousability to voice… appears comfortable")
- Boundary rule (BT, 23-Jul sort): documented unresponsiveness framed as settled/peaceful
  comfort belongs **here**, not in Theme 4 — *Non-responsive* observations went 18/18 to
  this theme
- Overwhelmingly staff-documented (46/59 staff voice)
- Present in **both arms** (28 DXM / 31 MDZ) — not an MDZ-only theme; the crossovers matter
- Judy's label: "comfortable quiescence"

### 3 · Nature of Observed Distress

> **Definition:** Symptoms seen that are distressing to patients, or factors that may be
> assumed as distressing, by an external observer — whether family, loved one, or
> clinician. Often related to delirium, anxiety, or agitation, given these are
> distressing, but could associate with other symptoms like severe pain.

Working notes (from the 22-Jul meeting, Judy's independent pass, and the 23-Jul sort):
- Episodes of distress and how they resolved — including symptom-driven distress
  (breathing etc.) where the distress, not the symptom management, is the content
- Two axes from Judy's pass, both worth preserving in the write-up: the **character** of
  distress (anxiety/panic/frustration vs terminal agitation/delirium/hallucinations) and
  the **route to settling** (relational reassurance vs pharmacological)
- The surviving family-involvement material largely lives here and in Theme 1
  ("settling with reassurance from her daughters")

### 4 · Rousable or Responsive Communication

> **Definition:** Whether a patient is able to communicate, verbally or non-verbally,
> and the content of that communication.
>
> *(Kylie: the word "rousability" must appear in this paper; this theme carries it.)*

Working notes (from the 22-Jul meeting, Judy's independent pass, and the 23-Jul sort):
- The rousability/responsiveness spectrum where **the patient's communicative capacity is
  itself the observation** — responsive to voice/touch, verbal exchanges, communicating
  needs, changes in responsiveness
- BT's framing (22-Jul meeting): "it's not so much what they're saying, it's whether
  they're able to say it"
- Arm patterning is a documentation-frequency finding, not a measured effect: higher-
  rousability quotes skew DXM (32/17 overall)
- Boundary with Theme 2: if unresponsiveness is framed as settled comfort → Theme 2;
  if rousability level or its change is the point of the note → here

---

## Stream (cross-cutting voice — derived, not coded)

Each in-scope quote carries a `stream` field, derived automatically:

| Stream | Rule |
|---|---|
| `staff` | Default — clinical documentation voice |
| `family (reported)` | Family view reported within clinical notes (v1 Family-domain rows) |
| `family (PCA)` | Direct family voice — Patient Comfort Assessment forms |

Staff and family perspectives are **nested within each theme** (22-Jul meeting, decision 3).
Family-vs-staff divergence is discussion material only, and only if shown in results.

---

## Coding new quotes (workflow from 23-Jul-2026)

1. Scope gate first (above).
2. Assign one theme (1–4). Ben calls it; AI validates against this codebook and flags
   boundary cases (esp. the Theme 2/4 line) — AI never assigns.
3. Optional freetext `subtheme` — within-theme patterns earn their place through repeated
   use; do not pre-invent. (None in use yet as of 23-Jul.)
4. `stream` is derived, not coded. For new quotes: PCA file → `family (PCA)`; family view
   reported in a clinical note → say so and it's logged `family (reported)`; else `staff`.
5. Old `code`/`subcode` fields are **not** assigned to new quotes.
6. Log via `log_quote.py` (v2 — takes `theme`, optional `subtheme`/`stream`/`note`).

---

## Appendix A — provenance: where the v1 sub-codes landed (empirical, 23-Jul sort)

Retained sub-codes and their theme destinations across the 157 in-scope quotes.
This table is provenance/retrieval only — these sub-codes are retired from active coding.

| v1 code › sub-code | Theme destination(s) |
|---|---|
| Communication › Verbal | T4 ×7 |
| Communication › Limited verbal | T4 ×1 |
| Communication › Responsive to voice | T4 ×13 |
| Communication › Responsive to touch | T4 ×1 |
| Communication › Minimally responsive | T1 ×3 |
| Communication › Non-responsive | T2 ×18 |
| Communication › Communicating needs | T4 ×5 · T3 ×1 |
| Communication › Difficulty communicating | T4 ×2 |
| Communication › Non-verbal | T4 ×1 |
| Communication › Confused | T4 ×2 |
| Communication › Change in responsiveness | T4 ×3 |
| Symptom Control › Agitation | T3 ×10 · T1 ×1 |
| Symptom Control › Anxiety | T3 ×1 · T4 ×1 |
| Symptom Control › Breathing distress | T3 ×1 |
| Symptom Control › Cognition intact | T4 ×1 |
| Symptom Control › Comfort achieved | T2 ×10 |
| Symptom Control › Delirium | T3 ×13 · T1 ×4 · T4 ×2 |
| Symptom Control › Fatigue | T4 ×1 |
| Symptom Control › Myoclonus | T1 ×1 |
| Symptom Control › Pain | T3 ×1 · T4 ×1 |
| Symptom Control › Psychological distress | T4 ×2 · T1 ×1 · T3 ×1 |
| Family › Family concern | T3 ×3 |
| Family › Family discussion | T2 ×3 · T3 ×2 |
| Family › Family present | T1 ×2 · T4 ×1 · T2 ×1 |
| Family › Family providing care | T1 ×1 · T2 ×1 |
| Family › Family satisfaction with care | T2 ×4 |
| Family › Family supported | T2 ×1 |
| Family › No family present | T2 ×1 |
| Patient-Centred Care › Comfort - Apparent | T2 ×19 · T1 ×3 · T4 ×2 |
| Patient-Centred Care › Comfort - Self Report | T4 ×1 |
| Patient-Centred Care › Emotional wellbeing | T4 ×2 · T2 ×1 |

## Appendix B — deprecated sub-codes (out of scope under v3; D12/D13)

All rows carrying these remain in `coded_quotes.json` with `status: deprecated` — nothing
deleted. Sub-codes fully or largely deprecated at triage: Breakthrough medication ·
Circulatory failure · Death rattle · Dizziness · Drug effect · Myoclonus · Nausea ·
Oedema · Pain / Pain controlled · Swallowing difficulty · Terminal phase breathing ·
Thermal discomfort · Fatigue (largely) · plus most Family-presence and PCC-environment
content, and Outside Framework › Deterioration. Individual keep-exceptions exist where
the content fed distress or comfort (see Appendix A).
