/**
 * مكون بطاقة المنتج
 * يعرض صورة المنتج والاسم والسعر وأزرار الإضافة والملاحظات
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, StickyNote } from 'lucide-react';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import NoteModal from './NoteModal';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // إضافة المنتج مباشرة بدون ملاحظات
  const handleQuickAdd = () => {
    addToCart(product, '');
  };

  // إضافة المنتج مع ملاحظات
  const handleAddWithNote = (p: Product, note: string) => {
    addToCart(p, note);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-amber-100 group"
      >
        {/* صورة المنتج */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/orange-juice.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {product.price.toLocaleString()} ل.س
          </div>
        </div>

        {/* معلومات المنتج */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-[#3E2723] mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-[#8D6E63] mb-4">{product.description}</p>

          {/* أزرار الإجراءات */}
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3E2723] hover:bg-[#5D4037] text-white py-2.5 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNoteModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2.5 rounded-xl font-medium transition-colors"
              title="إضافة ملاحظة"
            >
              <StickyNote className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* نافذة الملاحظات */}
      <NoteModal
        product={product}
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onConfirm={handleAddWithNote}
      />
    </>
  );
}
