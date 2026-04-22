export const CATEGORIES = [
  'Data Handling',
  'Access Controls',
  'Compliance',
  'Network & Infrastructure',
  'Business Continuity',
];

export const CATEGORY_COLORS = {
  'Data Handling': '#00e5a0',
  'Access Controls': '#7c8cf8',
  'Compliance': '#f5c842',
  'Network & Infrastructure': '#ff6b35',
  'Business Continuity': '#e879f9',
};

export const QUESTIONS = [
  {
    id: 'dh1',
    category: 'Data Handling',
    question: 'Does the vendor process, store, or transmit sensitive personal data (PII/PHI)?',
    options: [
      { label: 'No sensitive data processed', weight: 0 },
      { label: 'Anonymized or aggregated data only', weight: 1 },
      { label: 'Some PII (names, emails, etc.)', weight: 2 },
      { label: 'PII + financial or health data', weight: 3 },
    ],
  },
  {
    id: 'dh2',
    category: 'Data Handling',
    question: 'Where is customer data stored?',
    options: [
      { label: 'On-premise only', weight: 1 },
      { label: 'Domestic cloud provider', weight: 1 },
      { label: 'Multi-region / international cloud', weight: 2 },
      { label: 'Unknown or third-party subprocessors', weight: 3 },
    ],
  },
  {
    id: 'dh3',
    category: 'Data Handling',
    question: 'What is the vendor\'s data retention and deletion policy?',
    options: [
      { label: 'Defined policy, actively enforced', weight: 0 },
      { label: 'Policy exists but not consistently enforced', weight: 2 },
      { label: 'No formal policy', weight: 3 },
      { label: 'Unknown', weight: 3 },
    ],
  },
  {
    id: 'ac1',
    category: 'Access Controls',
    question: 'Does the vendor enforce multi-factor authentication (MFA)?',
    options: [
      { label: 'MFA required for all users and admins', weight: 0 },
      { label: 'MFA available but optional', weight: 2 },
      { label: 'No MFA available', weight: 3 },
      { label: 'Unknown', weight: 3 },
    ],
  },
  {
    id: 'ac2',
    category: 'Access Controls',
    question: 'How is privileged / admin access managed?',
    options: [
      { label: 'Formal PAM solution with audit trails', weight: 0 },
      { label: 'Role-based access, manually reviewed', weight: 1 },
      { label: 'Shared admin accounts in use', weight: 3 },
      { label: 'No formal process', weight: 3 },
    ],
  },
  {
    id: 'ac3',
    category: 'Access Controls',
    question: 'How frequently are user access rights reviewed?',
    options: [
      { label: 'Quarterly or more frequently', weight: 0 },
      { label: 'Annually', weight: 1 },
      { label: 'Ad-hoc or never', weight: 3 },
    ],
  },
  {
    id: 'cm1',
    category: 'Compliance',
    question: 'Which security certifications does the vendor hold?',
    options: [
      { label: 'SOC 2 Type II + ISO 27001 (or equivalent)', weight: 0 },
      { label: 'SOC 2 Type I or single framework', weight: 1 },
      { label: 'Self-attestation only', weight: 2 },
      { label: 'None or unknown', weight: 3 },
    ],
  },
  {
    id: 'cm2',
    category: 'Compliance',
    question: 'Has the vendor completed a third-party security audit in the last 12 months?',
    options: [
      { label: 'Yes — results shared with customers', weight: 0 },
      { label: 'Yes — internal audit only', weight: 2 },
      { label: 'No recent audit', weight: 3 },
    ],
  },
  {
    id: 'cm3',
    category: 'Compliance',
    question: 'Does the vendor have a formal incident response plan?',
    options: [
      { label: 'Documented and regularly tested', weight: 0 },
      { label: 'Documented but not tested', weight: 1 },
      { label: 'Informal or none', weight: 3 },
    ],
  },
  {
    id: 'ni1',
    category: 'Network & Infrastructure',
    question: 'Is data encrypted in transit and at rest?',
    options: [
      { label: 'Both encrypted (TLS 1.2+ / AES-256)', weight: 0 },
      { label: 'In transit only', weight: 2 },
      { label: 'Neither or unknown', weight: 3 },
    ],
  },
  {
    id: 'ni2',
    category: 'Network & Infrastructure',
    question: 'Does the vendor perform regular vulnerability scanning or penetration testing?',
    options: [
      { label: 'Continuous automated scanning + annual pentest', weight: 0 },
      { label: 'Periodic scans only', weight: 1 },
      { label: 'Only performed on request', weight: 2 },
      { label: 'No scanning or testing', weight: 3 },
    ],
  },
  {
    id: 'ni3',
    category: 'Network & Infrastructure',
    question: 'Is there network segmentation between customer environments?',
    options: [
      { label: 'Full environment isolation per customer', weight: 0 },
      { label: 'Logical segmentation in place', weight: 1 },
      { label: 'Shared infrastructure, no segmentation', weight: 3 },
      { label: 'Unknown', weight: 3 },
    ],
  },
  {
    id: 'bc1',
    category: 'Business Continuity',
    question: 'Does the vendor have a documented DR/BCP plan?',
    options: [
      { label: 'Tested DR plan with defined RTO/RPO', weight: 0 },
      { label: 'Plan exists but has not been tested', weight: 2 },
      { label: 'No formal plan', weight: 3 },
    ],
  },
  {
    id: 'bc2',
    category: 'Business Continuity',
    question: 'What is the vendor\'s documented uptime SLA?',
    options: [
      { label: '99.9% or higher', weight: 0 },
      { label: '99% – 99.9%', weight: 1 },
      { label: 'Below 99% or no SLA', weight: 2 },
    ],
  },
];

export function scoreAssessment(answers) {
  const maxPerQuestion = 3;
  const total = QUESTIONS.length * maxPerQuestion;

  const catScores = {};
  const catMaxes = {};

  CATEGORIES.forEach(c => {
    catScores[c] = 0;
    catMaxes[c] = 0;
  });

  QUESTIONS.forEach(q => {
    catMaxes[q.category] += maxPerQuestion;
    if (answers[q.id] !== undefined) {
      catScores[q.category] += answers[q.id].weight;
    }
  });

  const catPcts = {};
  CATEGORIES.forEach(c => {
    catPcts[c] = catMaxes[c] > 0 ? Math.round((catScores[c] / catMaxes[c]) * 100) : 0;
  });

  const totalWeight = Object.values(answers).reduce((sum, a) => sum + a.weight, 0);
  const overallScore = Math.round((totalWeight / total) * 100);

  let rating, ratingColor, ratingBg;
  if (overallScore < 20) {
    rating = 'Low'; ratingColor = '#00e5a0'; ratingBg = 'rgba(0,229,160,0.08)';
  } else if (overallScore < 45) {
    rating = 'Medium'; ratingColor = '#f5c842'; ratingBg = 'rgba(245,200,66,0.08)';
  } else if (overallScore < 70) {
    rating = 'High'; ratingColor = '#ff6b35'; ratingBg = 'rgba(255,107,53,0.08)';
  } else {
    rating = 'Critical'; ratingColor = '#ff3b5c'; ratingBg = 'rgba(255,59,92,0.08)';
  }

  const topCategory = CATEGORIES.reduce((a, b) => catPcts[a] > catPcts[b] ? a : b);
  const answeredCount = Object.keys(answers).length;

  return { overallScore, rating, ratingColor, ratingBg, catPcts, topCategory, answeredCount };
}