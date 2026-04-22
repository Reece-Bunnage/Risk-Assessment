import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadAssessments, deleteAssessment } from '../utils/storage';
import styles from './HistoryPage.module.css';

export default function HistoryPage() {
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAssessments(loadAssessments());
  }, []);

  function handleDelete(id, e) {
    e.stopPropagation();
    if (window.confirm('Delete this assessment?')) {
      deleteAssessment(id);
      setAssessments(loadAssessments());
    }
  }

  function handleView(assessment) {
    navigate('/results', { state: { assessment } });
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Assessment history</h1>
          <button className={styles.newBtn} onClick={() => navigate('/assess')}>
            New assessment →
          </button>
        </div>

        {assessments.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>◈</div>
            <p className={styles.emptyTitle}>No assessments yet</p>
            <p className={styles.emptyDesc}>Run your first vendor assessment to see results here.</p>
            <button className={styles.primaryBtn} onClick={() => navigate('/assess')}>
              Start an assessment
            </button>
          </div>
        ) : (
          <div className={styles.list}>
            {assessments.map((a, i) => {
              const { overallScore, rating, ratingColor, catPcts } = a.scoreResult;
              const date = new Date(a.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              });
              return (
                <div
                  key={a.id}
                  className={styles.card}
                  onClick={() => handleView(a)}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={styles.cardLeft}>
                    <div className={styles.scoreCircle} style={{ color: ratingColor, borderColor: `${ratingColor}40` }}>
                      {overallScore}
                    </div>
                    <div>
                      <div className={styles.vendorName}>{a.vendorName}</div>
                      <div className={styles.vendorMeta}>
                        {date}{a.vendorType ? ` · ${a.vendorType}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardRight}>
                    <span
                      className={styles.ratingBadge}
                      style={{ color: ratingColor, background: `${ratingColor}15`, borderColor: `${ratingColor}30` }}
                    >
                      {rating} Risk
                    </span>
                    <span className={styles.answeredBadge}>
                      {a.scoreResult.answeredCount}/14
                    </span>
                    {a.aiAnalysis && (
                      <span className={styles.aiBadge}>AI</span>
                    )}
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => handleDelete(a.id, e)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}