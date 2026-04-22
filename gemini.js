import { QUESTIONS, CATEGORIES } from '../data/questions';

export async function callGemini(apiKey, vendorName, answers, scoreResult) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const qaLines = QUESTIONS.map(q => {
    const a = answers[q.id];
    return `[${q.category}] ${q.question}\n  → ${a ? a.label : 'Not answered'} (risk weight: ${a ? a.weight : 'N/A'}/3)`;
  }).join('\n\n');

  const catSummary = CATEGORIES.map(c => `${c}: ${scoreResult.catPcts[c]}%`).join(', ');

  const prompt = `You are a senior cybersecurity consultant preparing a vendor risk assessment report.

VENDOR: ${vendorName}
OVERALL RISK SCORE: ${scoreResult.overallScore}/100 — ${scoreResult.rating} Risk
CATEGORY SCORES: ${catSummary}
QUESTIONS ANSWERED: ${scoreResult.answeredCount} of ${QUESTIONS.length}

QUESTIONNAIRE RESPONSES:
${qaLines}

Please provide a structured assessment with the following sections. Use plain text only — no markdown symbols, asterisks, or hashes.

EXECUTIVE SUMMARY
Write 2-3 sentences summarizing the vendor's overall risk posture in professional consulting language.

TOP RISKS IDENTIFIED
List the 3 most critical risks found in the responses. Be specific — reference the actual answers given, not generic risks.

REMEDIATION RECOMMENDATIONS
Provide 4-5 prioritized, actionable recommendations. For each, state what to do and why it reduces risk. Order from highest to lowest priority.

RISK OUTLOOK
One sentence on how the vendor's posture would change if top recommendations are implemented.

Keep the total response under 400 words. Tone: professional, direct, consulting-ready.`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini.');
  return text;
}