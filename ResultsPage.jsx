import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { CATEGORIES, CATEGORY_COLORS } from './questions';
import styles from './ResultsPage.module.css';

function RiskBadge({ rating, color }) {
  return (
    <span className={styles.badge} style={{ color, background: `${color}15`, border: `1px solid ${color}40` }}>
      {rating} Risk
    </span>
  );
}

function ScoreRing({ score, color }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x="70" y="66" textAnchor="middle" fill={color} fontSize="26" fontFamily="Syne" fontWeight="800">{score}</text>
      <text x="70" y="82" textAnchor="middle" fill="#8888aa" fontSize="11" fontFamily="DM Mono">/100</text>
    </svg>
  );
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const assessment = location.state?.assessment;

  if (!assessment) {
    return (
      <div className={styles.empty}>
        <p>No assessment data found.</p>
        <button className={styles.btn} onClick={() => navigate('/assess')}>Start an assessment</button>
      </div>
    );
  }

  const { vendorName, vendorType, scoreResult, aiAnalysis, createdAt } = assessment;
  const { overallScore, rating, ratingColor, catPcts, topCategory, answeredCount } = scoreResult;

  const barData = CATEGORIES.map(c => ({
    name: c.replace(' & ', ' &\n'),
    score: catPcts[c],
    color: CATEGORY_COLORS[c],
  }));

  const radarData = CATEGORIES.map(c => ({
    subject: c.split(' ')[0],
    value: catPcts[c],
    fullMark: 100,
  }));

  const dateStr = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  function parseAiSections(text) {
    if (!text) return null;
    const sections = [];
    const sectionHeaders = ['EXECUTIVE SUMMARY', 'TOP RISKS IDENTIFIED', 'REMEDIATION RECOMMENDATIONS', 'RISK OUTLOOK'];
    let remaining = text;

    sectionHeaders.forEach((header, i) => {
      const idx = remaining.indexOf(header);
      if (idx === -1) return;
      const nextHeader = sectionHeaders.slice(i + 1).find(h => remaining.indexOf(h, idx + header.length) !== -1);
      const end = nextHeader ? remaining.indexOf(nextHeader, idx + header.length) : remaining.length;
      const content = remaining.slice(idx + header.length, end).trim();
      sections.push({ title: header, content });
    });

    return sections.length > 0 ? sections : [{ title: 'AI Analysis', content: text }];
  }

  const aiSections = parseAiSections(aiAnalysis);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.meta}>
              {dateStr} {vendorType && `· ${vendorType}`}
            </div>
            <h1 className={styles.vendorName}>{vendorName}</h1>
            <RiskBadge rating={rating} color={ratingColor} />
          </div>
          <div className={styles.actions}>
            <button className={styles.outlineBtn} onClick={() => navigate('/assess')}>
              New assessment
            </button>
            <button className={styles.outlineBtn} onClick={() => navigate('/history')}>
              View history
            </button>
          </div>
        </div>

        {/* Score + metrics */}
        <div className={styles.scoreRow}>
          <div className={styles.scoreCard}>
            <ScoreRing score={overallScore} color={ratingColor} />
            <div>
              <div className={styles.scoreLabel}>Overall risk score</div>
              <div className={styles.scoreRating} style={{ color: ratingColor }}>{rating}</div>
              <div className={styles.scoreDesc}>Based on {answeredCount} answers</div>
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Top risk area</div>
              <div className={styles.metricValue}>{topCategory}</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Questions answered</div>
              <div className={styles.metricValue}>{answeredCount}/14</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Risk categories</div>
              <div className={styles.metricValue}>5 assessed</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Highest category %</div>
              <div className={styles.metricValue} style={{ color: ratingColor }}>
                {Math.max(...CATEGORIES.map(c => catPcts[c]))}%
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Risk by category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 8, right: 8, bottom: 8, left: -20 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#8888aa', fontSize: 11, fontFamily: 'DM Mono' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#8888aa', fontSize: 11, fontFamily: 'DM Mono' }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#18181f', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8, fontFamily: 'DM Mono', fontSize: 12
                  }}
                  labelStyle={{ color: '#f0f0f8' }}
                  formatter={(v) => [`${v}%`, 'Risk score']}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Risk radar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#8888aa', fontSize: 11, fontFamily: 'DM Mono' }}
                />
                <Radar
                  name="Risk" dataKey="value"
                  stroke={ratingColor} fill={ratingColor} fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown */}
        <div className={styles.breakdownCard}>
          <h3 className={styles.sectionTitle}>Category breakdown</h3>
          {CATEGORIES.map(cat => {
            const pct = catPcts[cat];
            const color = CATEGORY_COLORS[cat];
            return (
              <div key={cat} className={styles.catRow}>
                <span className={styles.catName}>{cat}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className={styles.catPct} style={{ color }}>{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* AI Analysis */}
        {aiAnalysis && (
          <div className={styles.aiCard}>
            <div className={styles.aiHeader}>
              <span className={styles.aiDot} />
              <span>Gemini AI analysis</span>
            </div>
            {aiSections ? (
              aiSections.map((sec, i) => (
                <div key={i} className={styles.aiSection}>
                  <h4 className={styles.aiSectionTitle}>{sec.title}</h4>
                  <p className={styles.aiText}>{sec.content}</p>
                </div>
              ))
            ) : (
              <p className={styles.aiText}>{aiAnalysis}</p>
            )}
          </div>
        )}

        {!aiAnalysis && (
          <div className={styles.noAiCard}>
            <p>No AI analysis — add your Gemini API key in <button className={styles.linkBtn} onClick={() => navigate('/settings')}>Settings</button> to enable it.</p>
          </div>
        )}

      </div>
    </div>
  );
}