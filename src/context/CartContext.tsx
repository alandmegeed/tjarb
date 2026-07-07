/**
 * سياق إدارة السلة
 * يدير حالة السلة ويوفر دوال لإضافة/إزالة/تعديل المنتجات
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product, CartItem } from '../data/products';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, note?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateNote: (productId: number, note: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // إضافة منتج إلى السلة
  const addToCart = useCallback((product: Product, note: string = '') => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1, note }];
    });
    setIsCartOpen(true);
  }, []);

  // إزالة منتج من السلة
  const removeFromCart = useCallback((productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  // تحديث كمية المنتج
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  // تحديث ملاحظة المنتج
  const updateNote = useCallback((productId: number, note: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, note } : item
      )
    );
  }, []);

  // تفريغ السلة
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // حساب عدد المنتجات الكلي
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // حساب السعر الإجمالي
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateNote,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
