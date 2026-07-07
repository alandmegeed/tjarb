/**
 * مكون رأس الصفحة
 * قابل للتعديل من الإعدادات
 */

import { ShoppingCart, Coffee } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { settings } = useSettings();

  return (
    <header
      className="sticky top-0 z-50 shadow-lg"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* الشعار */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">{settings.logoIcon}</span>
            <h1 className="text-xl sm:text-2xl font-bold text-amber-100">
              {settings.siteName}
            </h1>
          </motion.div>

          {/* زر السلة */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 text-white px-4 py-2 rounded-full transition-colors duration-200"
            style={{ backgroundColor: settings.accentColor }}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">السلة</span>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
