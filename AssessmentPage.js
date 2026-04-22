import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS, CATEGORIES, scoreAssessment } from './questions';
import { callGemini } from './gemini';
import { saveAssessment } from './storage';
import { loadSettings } from './storage';
import styles from './AssessmentPage.module.css';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const settings = loadSettings();

  const [vendorName, setVendorName] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

  function selectAnswer(questionId, option) {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  }

  function getCategoryProgress(cat) {
    const qs = QUESTIONS.filter(q => q.category === cat);
    const ans = qs.filter(q => answers[q.id]).length;
    return { total: qs.length, answered: ans };
  }

  async function handleSubmit() {
    if (!vendorName.trim()) {
      setError('Please enter a vendor name.');
      return;
    }
    if (answeredCount < Math.ceil(QUESTIONS.length * 0.6)) {
      setError(`Please answer at least ${Math.ceil(QUESTIONS.length * 0.6)} questions before submitting.`);
      return;
    }
    setError('');
    setLoading(true);

    try {
      setLoadingStep('Calculating risk scores...');
      const scoreResult = scoreAssessment(answers);

      let aiAnalysis = null;
      if (apiKey.trim()) {
        setLoadingStep('Running Gemini AI analysis...');
        try {
          aiAnalysis = await callGemini(apiKey.trim(), vendorName, answers, scoreResult);
        } catch (e) {
          aiAnalysis = `AI analysis unavailable: ${e.message}`;
        }
      }

      const assessment = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        vendorName: vendorName.trim(),
        vendorType: vendorType.trim(),
        answers,
        scoreResult,
        aiAnalysis,
      };

      saveAssessment(assessment);
      navigate('/results', { state: { assessment } });
    } catch (e) {
      setError(`Something went wrong: ${e.message}`);
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>New assessment</h1>
          <p className={styles.subtitle}>Answer each question based on your knowledge of the vendor.</p>
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.progressLabel}>
          <span>{answeredCount} / {QUESTIONS.length} answered</span>
          <span>{progress}%</span>
        </div>

        {/* Vendor info */}
        <div className={styles.vendorCard}>
          <h2 className={styles.sectionTitle}>Vendor information</h2>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Vendor name *</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. Acme Cloud Services"
                value={vendorName}
                onChange={e => setVendorName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Vendor type</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. SaaS, Cloud Infrastructure, Payroll"
                value={vendorType}
                onChange={e => setVendorType(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Gemini API key
              <span className={styles.labelNote}> — for AI analysis (optional)</span>
            </label>
            <input
              className={styles.input}
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
          </div>
        </div>

        {/* Questions by category */}
        {CATEGORIES.map(cat => {
          const catQuestions = QUESTIONS.filter(q => q.category === cat);
          const { answered, total } = getCategoryProgress(cat);
          return (
            <div key={cat} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{cat}</h2>
                <span className={styles.categoryCount}>{answered}/{total}</span>
              </div>

              {catQuestions.map(q => {
                const selected = answers[q.id];
                return (
                  <div key={q.id} className={`${styles.questionCard} ${selected ? styles.answered : ''}`}>
                    <p className={styles.questionText}>{q.question}</p>
                    <div className={styles.options}>
                      {q.options.map((opt, i) => {
                        const isSelected = selected?.label === opt.label;
                        const riskClass = opt.weight === 0 ? styles.optLow
                          : opt.weight === 1 ? styles.optLow
                          : opt.weight === 2 ? styles.optMed
                          : styles.optHigh;
                        return (
                          <button
                            key={i}
                            className={`${styles.option} ${isSelected ? styles.optSelected : ''} ${isSelected ? riskClass : ''}`}
                            onClick={() => selectAnswer(q.id, opt)}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.submitRow}>
          <div className={styles.submitInfo}>
            {answeredCount < QUESTIONS.length && (
              <span className={styles.submitNote}>
                {QUESTIONS.length - answeredCount} questions remaining
              </span>
            )}
          </div>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading || answeredCount < Math.ceil(QUESTIONS.length * 0.6)}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                {loadingStep}
              </>
            ) : (
              'Generate risk report →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}