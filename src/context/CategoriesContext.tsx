/**
 * سياق إدارة الفئات (الأقسام)
 * يسمح بإضافة/تعديل/حذف الفئات ديناميكياً
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadPersistedState, savePersistedState } from '../lib/persistedState';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

const defaultCategories: Category[] = [
  { id: 'juices', name: 'عصائر طازجة', icon: '🍹' },
  { id: 'shisha', name: 'أراكيل', icon: '💨' },
  { id: 'drinks', name: 'مشروبات', icon: '☕' },
];

const CATEGORIES_KEY = 'coffee-shop-categories';

interface CategoriesContextType {
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getNextCategoryId: () => string;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const saved = await loadPersistedState<Category[]>(CATEGORIES_KEY, defaultCategories);
      if (!cancelled) {
        setCategories(saved);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    savePersistedState(CATEGORIES_KEY, categories);
  }, [categories]);

  const getNextCategoryId = useCallback(() => {
    return 'cat_' + Date.now();
  }, []);

  const addCategory = useCallback((cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: getNextCategoryId(),
    };
    setCategories((prev) => [...prev, newCat]);
  }, [getNextCategoryId]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <CategoriesContext.Provider
      value={{ categories, addCategory, updateCategory, deleteCategory, getNextCategoryId }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}
