/**
 * سياق إدارة إعدادات الموقع
 * يحفظ جميع الإعدادات في localStorage
 * الإعدادات القابلة للتعديل:
 * - اسم المحل
 * - الشعار
 * - الألوان (ثيم)
 * - صورة الخلفية
 * - رقم الواتساب
 * - معلومات التواصل
 * - ساعات العمل
 * - نص الترحيب
 * - كلمة مرور الأدمن
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadPersistedState, savePersistedState } from '../lib/persistedState';

export interface SiteSettings {
  // اسم المحل
  siteName: string;
  siteSubtitle: string;
  welcomeTitle: string;
  welcomeText: string;

  // الألوان
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;

  // الصور
  heroImage: string;
  logoIcon: string;

  // التواصل
  phone: string;
  address: string;
  workingHours: string;
  whatsappNumber: string;

  // الأدمن
  adminPassword: string;

  // العملة
  currency: string;
  currencySymbol: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'مقهى الأصالة',
  siteSubtitle: 'عصائر طازجة | أراكيل | مشروبات',
  welcomeTitle: 'مرحباً بك في مقهى الأصالة',
  welcomeText:
    'استمتع بأفضل العصائر الطازجة، الأراكيل الفاخرة، والمشروبات الساخنة في أجواء مريحة وفاخرة',

  primaryColor: '#3E2723',
  secondaryColor: '#5D4037',
  accentColor: '#D84315',
  bgColor: '#FFF8E7',

  heroImage:
    'https://images.pexels.com/photos/36484101/pexels-photo-36484101/free-photo-of-modern-cozy-indoor-cafe-with-stylish-decor.jpeg?auto=compress&cs=tinysrgb&w=1920',
  logoIcon: '☕',

  phone: '+963 937 296 510',
  address: 'شارع الجامعة، المدينة',
  workingHours: 'يومياً: 8 ص - 2 ص',
  whatsappNumber: '963937296510',

  adminPassword: 'admin123',

  currency: 'ليرة سورية',
  currencySymbol: 'ل.س',
};

const SETTINGS_KEY = 'coffee-shop-settings';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const saved = await loadPersistedState<Partial<SiteSettings>>(SETTINGS_KEY, {});
      if (!cancelled) {
        setSettings({ ...defaultSettings, ...saved });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    savePersistedState(SETTINGS_KEY, settings);
  }, [settings]);

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
