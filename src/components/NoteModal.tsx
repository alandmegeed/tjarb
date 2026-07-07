/**
 * نافذة إضافة الملاحظات
 * تظهر عند الضغط على زر إضافة ملاحظة للمنتج
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';
import type { Product } from '../data/products';

interface NoteModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, note: string) => void;
}

export default function NoteModal({
  product,
  isOpen,
  onClose,
  onConfirm,
}: NoteModalProps) {
  const [note, setNote] = useState('');

  if (!product) return null;

  const handleConfirm = () => {
    onConfirm(product, note);
    setNote('');
    onClose();
  };

  // اقتراحات الملاحظات حسب نوع المنتج
  const getSuggestions = () => {
    if (product.category === 'juices') {
      return ['سكر قليل', 'بدون سكر', 'ثلج إضافي', 'حجم كبير'];
    }
    if (product.category === 'shisha') {
      return ['فحم طبيعي', 'فحم سريع', 'نكهة إضافية', 'رأس جديد'];
    }
    return ['سكر قليل', 'حليب إضافي', 'ساخن جداً', 'بارد'];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFF8E7] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-amber-200"
          >
            {/* رأس النافذة */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-[#3E2723]">
                  إضافة ملاحظة
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-amber-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#5D4037]" />
              </button>
            </div>

            {/* اسم المنتج */}
            <p className="text-[#5D4037] mb-4 font-medium">{product.name}</p>

            {/* حقل الملاحظة */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب ملاحظتك هنا..."
              className="w-full h-24 p-3 border border-amber-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-[#3E2723] placeholder-amber-400/70"
              dir="rtl"
            />

            {/* اقتراحات سريعة */}
            <div className="mt-3 flex flex-wrap gap-2">
              {getSuggestions().map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setNote(suggestion)}
                  className="text-sm px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* أزرار التأكيد والإلغاء */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl font-medium transition-colors"
              >
                إضافة إلى السلة
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-xl font-medium transition-colors"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
