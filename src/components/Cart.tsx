/**
 * مكون السلة
 * يعرض المنتجات المضافة مع إمكانية تعديل الكمية والملاحظات
 * وزر إتمام الشراء عبر واتساب
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageSquare,
  Send,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useState } from 'react';

export default function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    updateNote,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();
  const { settings } = useSettings();

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // إغلاق السلة عند الضغط على الخلفية
  const handleBackdropClick = () => {
    setIsCartOpen(false);
  };

  // بدء تعديل الملاحظة
  const startEditNote = (id: number, currentNote: string) => {
    setEditingNoteId(id);
    setNoteInput(currentNote);
  };

  // حفظ الملاحظة
  const saveNote = (id: number) => {
    updateNote(id, noteInput);
    setEditingNoteId(null);
    setNoteInput('');
  };

  // إنشاء رسالة واتساب
  const generateWhatsAppMessage = () => {
    let message = '*مرحباً، أريد طلب من ' + settings.siteName + '*\n\n';
    items.forEach((item) => {
      message += `• ${item.name} × ${item.quantity}`;
      if (item.note) {
        message += ` _(ملاحظة: ${item.note})_`;
      }
      message += '\n';
    });
    message += `\n*المجموع: ${totalPrice.toLocaleString()} ${settings.currencySymbol}*`;
    return encodeURIComponent(message);
  };

  // فتح واتساب
  const handleCheckout = () => {
    if (items.length === 0) return;
    const message = generateWhatsAppMessage();
    const phoneNumber = settings.whatsappNumber;
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* خلفية شفافة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm"
          />

          {/* لوحة السلة */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[50] h-full w-full sm:w-[420px] bg-[#FFF8E7] shadow-2xl flex flex-col"
          >
            {/* رأس السلة */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-amber-200 bg-[#3E2723]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold text-amber-100">
                  سلة المشتريات
                </h2>
                {totalItems > 0 && (
                  <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-amber-200" />
              </button>
            </div>

            {/* محتوى السلة */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-amber-300 mb-4" />
                  <p className="text-lg font-medium text-[#5D4037]">
                    السلة فارغة
                  </p>
                  <p className="text-sm text-[#8D6E63] mt-1">
                    أضف بعض المنتجات لتظهر هنا
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-amber-100"
                      >
                        {/* معلومات المنتج */}
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#3E2723] text-sm">
                              {item.name}
                            </h4>
                            <p className="text-amber-600 font-bold text-sm mt-0.5">
                              {item.price.toLocaleString()} {settings.currencySymbol}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* التحكم في الكمية */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold text-[#3E2723]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-bold text-[#3E2723]">
                            {(item.price * item.quantity).toLocaleString()} {settings.currencySymbol}
                          </p>
                        </div>

                        {/* الملاحظات */}
                        <div className="mt-3">
                          {editingNoteId === item.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder="اكتب ملاحظتك..."
                                className="flex-1 text-sm px-3 py-1.5 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-[#3E2723]"
                                dir="rtl"
                                autoFocus
                              />
                              <button
                                onClick={() => saveNote(item.id)}
                                className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-500 transition-colors"
                              >
                                حفظ
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                startEditNote(item.id, item.note)
                              }
                              className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              {item.note ? (
                                <span className="truncate max-w-[200px]">
                                  {item.note}
                                </span>
                              ) : (
                                <span>إضافة ملاحظة</span>
                              )}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* تذييل السلة */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-amber-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#5D4037] font-medium">
                    عدد المنتجات: {totalItems}
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    تفريغ السلة
                  </button>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-[#3E2723]">
                    المجموع:
                  </span>
                  <span className="text-2xl font-bold text-amber-600">
                    {totalPrice.toLocaleString()} {settings.currencySymbol}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3.5 rounded-xl font-bold text-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                  إتمام الشراء عبر واتساب
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
