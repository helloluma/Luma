// Luma engine client, types, and demo mock data.
//
// The demo screen talks to the Next route handler at /api/verify, which in turn
// proxies the real Python engine (default http://localhost:8000/verify). When the
// engine is unreachable the route falls back to MOCK_RESULT so the page never breaks.

export type Support = "supported" | "unsupported" | "partial";

export interface Claim {
  id: string;
  text: string;
}

export interface Citation {
  source_id: string; // PMID
  title: string;
  snippet: string;
  url: string;
  source: "pubmed";
}

export interface Verdict {
  claim: Claim;
  support: Support;
  citation: Citation | null;
  rationale: string;
  evidence_strength: number | null;
  confidence: number; // 0..1
}

export interface PipelineResult {
  question: string;
  draft_answer: string;
  verdicts: Verdict[];
  mocked?: boolean; // set by the route when it falls back to demo data
}

export interface PlainCitation {
  label: string;
  pmid: string;
  fabricated: boolean;
}

export interface PlainResult {
  answer: string;
  citations: PlainCitation[];
}

/**
 * POST a question to the Next route handler, which proxies the real engine and
 * falls back to mock data on any failure. Always resolves to a PipelineResult.
 */
export async function verify(question: string): Promise<PipelineResult> {
  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = (await res.json()) as PipelineResult;
  // The route sets a header too, but the body carries `mocked` for the client.
  if (res.headers.get("x-luma-mocked") === "true") {
    data.mocked = true;
  }
  return data;
}

// ------------------------------------------------------------------ //
// Demo data — real cardiology topic, real-looking PubMed records.     //
// ------------------------------------------------------------------ //

const MOCK_QUESTION =
  "Do ACE inhibitors cause a dry cough, and what else is first-line for heart failure with reduced ejection fraction?";

export const MOCK_RESULT: PipelineResult = {
  question: MOCK_QUESTION,
  draft_answer:
    "ACE inhibitors commonly cause a persistent dry cough, driven by bradykinin accumulation, and switching to an angiotensin receptor blocker resolves it in most patients. Alongside an ACE inhibitor or ARB, first-line therapy for heart failure with reduced ejection fraction includes an evidence-based beta-blocker and a mineralocorticoid receptor antagonist such as spironolactone. Sacubitril/valsartan reduces cardiovascular death and hospitalization compared with enalapril, and SGLT2 inhibitors are now added as a fourth pillar.",
  verdicts: [
    {
      claim: {
        id: "c1",
        text: "ACE inhibitors commonly cause a persistent dry cough driven by bradykinin accumulation.",
      },
      support: "supported",
      citation: {
        source_id: "1524066",
        title:
          "Cough and angiotensin II receptor antagonists: a review of the mechanisms and clinical significance",
        snippet:
          "ACE inhibition reduces the degradation of bradykinin and substance P in the respiratory tract, and their accumulation is implicated in the dry cough reported by up to 15% of treated patients.",
        url: "https://pubmed.ncbi.nlm.nih.gov/1524066/",
        source: "pubmed",
      },
      rationale:
        "The bradykinin mechanism and cough incidence are directly described in the cited review.",
      evidence_strength: 0.82,
      confidence: 0.94,
    },
    {
      claim: {
        id: "c2",
        text: "An evidence-based beta-blocker is a first-line therapy for heart failure with reduced ejection fraction.",
      },
      support: "supported",
      citation: {
        source_id: "10376614",
        title:
          "The effect of carvedilol on morbidity and mortality in patients with chronic heart failure (CIBIS-II / carvedilol program)",
        snippet:
          "Beta-blockade reduced all-cause mortality by 35% in patients with chronic heart failure already receiving diuretics and ACE inhibitors, establishing it as a cornerstone of therapy.",
        url: "https://pubmed.ncbi.nlm.nih.gov/10376614/",
        source: "pubmed",
      },
      rationale:
        "Mortality benefit of beta-blockade in HFrEF is supported by the cited randomized program.",
      evidence_strength: 0.88,
      confidence: 0.92,
    },
    {
      claim: {
        id: "c3",
        text: "Spironolactone, a mineralocorticoid receptor antagonist, reduces mortality in severe heart failure.",
      },
      support: "supported",
      citation: {
        source_id: "10471456",
        title:
          "The effect of spironolactone on morbidity and mortality in patients with severe heart failure (RALES)",
        snippet:
          "Among patients with severe heart failure, spironolactone reduced the risk of death by 30% compared with placebo when added to standard therapy.",
        url: "https://pubmed.ncbi.nlm.nih.gov/10471456/",
        source: "pubmed",
      },
      rationale:
        "The RALES trial directly reports the 30% mortality reduction with spironolactone.",
      evidence_strength: 0.9,
      confidence: 0.93,
    },
    {
      claim: {
        id: "c4",
        text: "Sacubitril/valsartan reduces cardiovascular death and hospitalization compared with enalapril.",
      },
      support: "supported",
      citation: {
        source_id: "25176015",
        title:
          "Angiotensin-neprilysin inhibition versus enalapril in heart failure (PARADIGM-HF)",
        snippet:
          "Sacubitril/valsartan was superior to enalapril in reducing the risks of death and of hospitalization for heart failure.",
        url: "https://pubmed.ncbi.nlm.nih.gov/25176015/",
        source: "pubmed",
      },
      rationale:
        "PARADIGM-HF is the pivotal trial establishing superiority over enalapril.",
      evidence_strength: 0.91,
      confidence: 0.95,
    },
    {
      claim: {
        id: "c5",
        text: "Switching to an angiotensin receptor blocker resolves ACE-inhibitor cough in essentially all patients.",
      },
      support: "unsupported",
      citation: null,
      rationale:
        "No retrieved source supports resolution in 'essentially all' patients. The literature reports that cough resolves in most, not all, and recurrence rates vary. This overstated claim could not be grounded.",
      evidence_strength: null,
      confidence: 0.41,
    },
  ],
};

export const MOCK_PLAIN: PlainResult = {
  answer:
    "ACE inhibitors commonly cause a persistent dry cough, driven by bradykinin accumulation [1], and switching to an angiotensin receptor blocker resolves it in essentially all patients [2]. Alongside an ACE inhibitor or ARB, first-line therapy for heart failure with reduced ejection fraction includes an evidence-based beta-blocker [3] and a mineralocorticoid receptor antagonist such as spironolactone, which reduced mortality by 30% in the RALES trial [4].",
  citations: [
    { label: "1", pmid: "1524066", fabricated: false },
    { label: "2", pmid: "20984872", fabricated: true },
    { label: "3", pmid: "10376614", fabricated: false },
    { label: "4", pmid: "38112203", fabricated: true },
  ],
};
