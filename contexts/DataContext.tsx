import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Activity, Crisis, Notification, MonthlyReport, Holiday } from '../types';
import { dataService } from '../services/dataService';

interface DataContextType {
  activities: Activity[];
  crises: Crisis[];
  notifications: Notification[];
  monthlyReports: Record<string, MonthlyReport>;
  holidays: Holiday[];
  addActivity: (act: Activity) => void;
  updateActivity: (id: string, field: keyof Activity, value: any) => void;
  deleteActivity: (id: string) => void;
  addCrisis: (crisis: Crisis) => void;
  updateCrisis: (id: string, field: keyof Crisis, value: any) => void;
  deleteCrisis: (id: string) => void;
  addNotification: (text: string) => void;
  deleteNotification: (id: string) => void;
  updateReport: (month: number, field: keyof MonthlyReport, value: string) => void;
  addHoliday: (h: Holiday) => void;
  deleteHoliday: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(dataService.load());

  // Save to local storage whenever data changes
  useEffect(() => {
    dataService.save(data);
  }, [data]);

  const addActivity = (act: Activity) => setData(prev => ({ ...prev, activities: [...prev.activities, act] }));
  
  const updateActivity = (id: string, field: keyof Activity, value: any) => {
    setData(prev => ({
      ...prev,
      activities: prev.activities.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const deleteActivity = (id: string) => {
    setData(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== id) }));
  };

  const addCrisis = (crisis: Crisis) => setData(prev => ({ ...prev, crises: [...prev.crises, crisis] }));

  const updateCrisis = (id: string, field: keyof Crisis, value: any) => {
    setData(prev => ({
      ...prev,
      crises: prev.crises.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const deleteCrisis = (id: string) => {
    setData(prev => ({ ...prev, crises: prev.crises.filter(c => c.id !== id) }));
  };

  const addNotification = (text: string) => {
    const newNotif: Notification = { id: Date.now().toString(), text, timestamp: new Date().toISOString() };
    setData(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications] }));
  };

  const deleteNotification = (id: string) => {
    setData(prev => ({ ...prev, notifications: prev.notifications.filter(n => n.id !== id) }));
  };

  const updateReport = (month: number, field: keyof MonthlyReport, value: string) => {
    setData(prev => ({
      ...prev,
      monthlyReports: {
        ...prev.monthlyReports,
        [month]: {
          ...(prev.monthlyReports[month] || { explanation: '', highlights: '', suggestions: '' }),
          [field]: value
        }
      }
    }));
  };

  const addHoliday = (h: Holiday) => setData(prev => ({ ...prev, holidays: [...prev.holidays, h] }));
  const deleteHoliday = (id: string) => setData(prev => ({ ...prev, holidays: prev.holidays.filter(h => h.id !== id) }));

  return (
    <DataContext.Provider value={{
      ...data,
      addActivity, updateActivity, deleteActivity,
      addCrisis, updateCrisis, deleteCrisis,
      addNotification, deleteNotification,
      updateReport, addHoliday, deleteHoliday
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};