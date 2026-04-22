const STORAGE_KEY = 'vendorguard_assessments';
const SETTINGS_KEY = 'vendorguard_settings';

export function saveAssessment(assessment) {
  const existing = loadAssessments();
  const updated = [assessment, ...existing].slice(0, 50); // keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function loadAssessments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteAssessment(id) {
  const existing = loadAssessments();
  const updated = existing.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAssessments() {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { geminiApiKey: '', orgName: '' };
  } catch {
    return { geminiApiKey: '', orgName: '' };
  }
}