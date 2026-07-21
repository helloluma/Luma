"""Hand-labeled cardiology claims. Ground truth for hallucination recall + calibration.

Each probe is a single, well-established true statement or a plausible-sounding
false one. Running these through Retrieve -> Verify -> Score tests whether Luma
grounds the true ones and flags the false ones (which a bare LLM asserts anyway).
"""

from __future__ import annotations

from pydantic import BaseModel

from luma.models import Claim


class Probe(BaseModel):
    text: str
    is_true: bool
    note: str = ""

    def as_claim(self, idx: int) -> Claim:
        return Claim(id=f"probe{idx}", text=self.text)


CARDIOLOGY_PROBES: list[Probe] = [
    # --- true ---
    Probe(text="Atorvastatin lowers LDL cholesterol.", is_true=True),
    Probe(text="Beta-blockers reduce resting heart rate.", is_true=True),
    Probe(text="Aspirin inhibits platelet aggregation.", is_true=True),
    Probe(text="ACE inhibitors can cause a persistent dry cough.", is_true=True),
    Probe(text="Atrial fibrillation increases the risk of ischemic stroke.", is_true=True),
    # --- false ---
    Probe(
        text="Statins raise LDL cholesterol.",
        is_true=False,
        note="Inverted mechanism; statins lower LDL.",
    ),
    Probe(
        text="Nitroglycerin increases myocardial oxygen demand.",
        is_true=False,
        note="It reduces demand and improves supply.",
    ),
    Probe(
        text="Warfarin therapy does not require INR monitoring.",
        is_true=False,
        note="INR monitoring is required.",
    ),
    Probe(
        text="Calcium channel blockers cure coronary artery disease.",
        is_true=False,
        note="They manage symptoms; there is no cure.",
    ),
    Probe(
        text="Beta-blockers are contraindicated in all patients with hypertension.",
        is_true=False,
        note="They are a treatment for hypertension in many patients.",
    ),
]


# Adversarial set: plausible traps a bare LLM asserts confidently, plus subtle/recent
# truths it tends to hedge or reject. This is where grounding should separate Luma from
# the parametric baseline (or where we learn it doesn't). Ground truth = named trials.
HARD_CARDIOLOGY_PROBES: list[Probe] = [
    # --- true, but subtle or recent (parametric model often hedges/rejects) ---
    Probe(
        text="Colchicine reduces the risk of cardiovascular events in patients with "
        "established coronary artery disease.",
        is_true=True,
        note="COLCOT (2019) and LoDoCo2 (2020); recent, anti-inflammatory mechanism.",
    ),
    Probe(
        text="Spironolactone reduces mortality in patients with severe heart failure "
        "with reduced ejection fraction.",
        is_true=True,
        note="RALES (1999), ~30% mortality reduction in NYHA III-IV HFrEF.",
    ),
    Probe(
        text="Digoxin reduces heart failure hospitalizations but does not reduce "
        "all-cause mortality.",
        is_true=True,
        note="DIG trial (1997); two-part claim, both parts correct.",
    ),
    Probe(
        text="Ivabradine lowers heart rate without lowering blood pressure.",
        is_true=True,
        note="Selective I_f (funny current) inhibition at the SA node; counterintuitive.",
    ),
    Probe(
        text="In heart failure with reduced ejection fraction, sacubitril/valsartan "
        "reduced cardiovascular death compared with enalapril.",
        is_true=True,
        note="PARADIGM-HF (2014), HR ~0.80 for CV death.",
    ),
    # --- false, but plausible traps (parametric model rubber-stamps) ---
    Probe(
        text="Ivabradine lowers heart rate by blocking beta-1 adrenergic receptors.",
        is_true=False,
        note="Wrong mechanism: it blocks the I_f funny current, not beta receptors.",
    ),
    Probe(
        text="In the ISCHEMIA trial, an initial invasive strategy reduced all-cause "
        "mortality compared with optimal medical therapy in stable coronary disease.",
        is_true=False,
        note="ISCHEMIA (2020) found no mortality benefit; intuitive-but-wrong prior.",
    ),
    Probe(
        text="Aspirin is recommended for routine primary prevention of cardiovascular "
        "disease in all healthy adults over 50.",
        is_true=False,
        note="Guidelines (2019 ACC/AHA, 2022 USPSTF) walked this back over bleeding risk.",
    ),
    Probe(
        text="Sacubitril/valsartan lowers blood pressure primarily by directly inhibiting renin.",
        is_true=False,
        note="It is a neprilysin inhibitor plus an ARB; it does not inhibit renin.",
    ),
    Probe(
        text="Flecainide is recommended for rhythm control in patients with a prior "
        "myocardial infarction or structural heart disease.",
        is_true=False,
        note="CAST trial: class IC agents raise mortality post-MI; contraindicated there.",
    ),
]

# Blind-spot set: mechanism/scope/outdated-belief traps rather than famous-trial
# conclusions. These target where a parametric model tends to over-generalize or
# carry a stale prior (e.g. "DOACs have no antidote", "SGLT2i is only for diabetics").
# NOTE: a frontier model may still ace these; genuine post-cutoff blind spots require a
# curated recent-literature set we should not fabricate from memory (see RECAP open thread).
BLINDSPOT_CARDIOLOGY_PROBES: list[Probe] = [
    # --- true, subtle mechanism/scope ---
    Probe(
        text="Sacubitril/valsartan must not be co-administered with an ACE inhibitor "
        "because of the risk of angioedema.",
        is_true=True,
        note="Contraindicated together; 36-hour washout required.",
    ),
    Probe(
        text="PCSK9 inhibitors lower LDL cholesterol by increasing the number of "
        "LDL receptors available on hepatocytes.",
        is_true=True,
        note="They block PCSK9-mediated LDL-receptor degradation, so receptors recycle.",
    ),
    Probe(
        text="Empagliflozin reduces heart failure hospitalizations even in patients "
        "who do not have diabetes.",
        is_true=True,
        note="EMPEROR-Reduced / DAPA-HF: benefit independent of diabetes status.",
    ),
    # --- false, plausible-but-stale or class-confusion traps ---
    Probe(
        text="Dabigatran's anticoagulant effect cannot be reversed by any specific agent.",
        is_true=False,
        note="Idarucizumab is a specific reversal agent; 'DOACs have no antidote' is stale.",
    ),
    Probe(
        text="Ticagrelor, like clopidogrel, is a prodrug that requires hepatic "
        "activation to inhibit platelets.",
        is_true=False,
        note="Ticagrelor is directly active, not a prodrug; only clopidogrel needs activation.",
    ),
]

PROBE_SETS: dict[str, list[Probe]] = {
    "standard": CARDIOLOGY_PROBES,
    "hard": HARD_CARDIOLOGY_PROBES,
    "blindspot": BLINDSPOT_CARDIOLOGY_PROBES,
    "all": CARDIOLOGY_PROBES + HARD_CARDIOLOGY_PROBES + BLINDSPOT_CARDIOLOGY_PROBES,
}
