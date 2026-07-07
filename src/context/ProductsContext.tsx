/**
 * سياق إدارة المنتجات
 * يحفظ المنتجات في localStorage ويوفر دوال لإضافة/تعديل/حذف
 * فقط الأدمن يستطيع التعديل
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '../data/products';
import { defaultProducts } from '../data/products';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getNextId: () => number;
}

const PRODUCTS_KEY = 'coffee-shop-products';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultProducts;
      }
    }
    return defaultProducts;
  });

  // حفظ المنتجات في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  const getNextId = useCallback(() => {
    if (products.length === 0) return 1;
    return Math.max(...products.map((p) => p.id)) + 1;
  }, [products]);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: getNextId(),
    };
    setProducts((prev) => [...prev, newProduct]);
  }, [getNextId]);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getNextId }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
