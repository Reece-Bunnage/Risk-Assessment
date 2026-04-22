import React, { useState } from 'react';
import { saveSettings, loadSettings } from './storage';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const existing = loadSettings();
  const [geminiApiKey, setGeminiApiKey] = useState(existing.geminiApiKey || '');
  const [orgName, setOrgName] = useState(existing.orgName || '');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    saveSettings({
      geminiApiKey: geminiApiKey.trim(),
      orgName: orgName.trim(),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Store default values used in new risk assessments.</p>

        <div className={styles.field}>
          <label className={styles.label}>Organization name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Your company"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Gemini API key</label>
          <input
            className={styles.input}
            type="password"
            placeholder="AIza..."
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.saveBtn} onClick={handleSave}>Save settings</button>
          {saved && <span className={styles.saved}>Saved</span>}
        </div>
      </div>
    </div>
  );
}
