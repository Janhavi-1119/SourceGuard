import { SavedReport } from '../types';

const STORAGE_KEY = 'verifai-saved-reports';

export function getSavedReports(): SavedReport[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveReport(report: SavedReport): void {
  const reports = getSavedReports();
  const existing = reports.findIndex((r) => r.id === report.id);
  if (existing >= 0) {
    reports[existing] = report;
  } else {
    reports.unshift(report);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function deleteReport(id: string): void {
  const reports = getSavedReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function getReport(id: string): SavedReport | undefined {
  return getSavedReports().find((r) => r.id === id);
}
