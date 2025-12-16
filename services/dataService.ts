import { Activity, Crisis, Notification, MonthlyReport, Holiday } from '../types';

const DB_KEY = 'evereste_comunicacao_v3';

interface AppData {
  activities: Activity[];
  crises: Crisis[];
  notifications: Notification[];
  monthlyReports: Record<string, MonthlyReport>;
  holidays: Holiday[];
}

const INITIAL_DATA: AppData = {
  activities: [],
  crises: [],
  notifications: [],
  monthlyReports: {},
  holidays: [{ id: '1', month: 0, day: '01', name: 'Confraternização Universal' }],
};

export const dataService = {
  load: (): AppData => {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to load data", e);
    }
    return INITIAL_DATA;
  },

  save: (data: AppData) => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  }
};