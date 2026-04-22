import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

const FEATURES = [
  {
    icon: '◈',
    title: '14-question framework',
    desc: 'Covers data handling, access controls, compliance, network security, and business continuity.',
  },
  {
    icon: '◎',
    title: 'Instant risk scoring',
    desc: 'Weighted scoring engine calculates an overall risk score and per-category breakdown.',
  },
  {
    icon: '◉',
    title: 'Gemini AI analysis',
    desc: 'AI-generated executive summary with prioritized remediation recommendations.',
  },
  {
    icon: '◇',
    title: 'Assessment history',
    desc: 'All past assessments stored locally so you can track vendor posture over time.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.heroGrid} />

      <section className={styles.hero}>
        <div className={styles.badge}>AI-powered security assessment</div>
        <h1 className={styles.headline}>
          Know the risk<br />
          <span className={styles.accent}>before you sign.</span>
        </h1>
        <p className={styles.sub}>
          bunnage shield helps security and compliance teams evaluate third-party vendor risk
          in minutes — not weeks. Answer 14 questions, get an AI-generated risk report.
        </p>
        <div className={styles.heroActions}>
          <button className={styles.primaryBtn} onClick={() => navigate('/assess')}>
            Start assessment →
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/history')}>
            View history
          </button>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>14</span>
            <span className={styles.statLabel}>questions</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>5</span>
            <span className={styles.statLabel}>risk categories</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>AI</span>
            <span className={styles.statLabel}>remediation advice</span>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard} style={{ animationDelay: `${i * 0.08}s` }}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to assess a vendor?</h2>
          <p className={styles.ctaDesc}>Takes about 5 minutes. No account required.</p>
          <button className={styles.primaryBtn} onClick={() => navigate('/assess')}>
            Run your first assessment →
          </button>
        </div>
      </section>
    </div>
  );
}