/**
 * مكون البانر الرئيسي
 * قابل للتعديل من الإعدادات
 */

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Hero() {
  const { settings } = useSettings();

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
      {/* صورة الخلفية */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${settings.heroImage})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${settings.primaryColor}d9 0%, ${settings.secondaryColor}c0 100%)`,
          }}
        />
      </div>

      {/* المحتوى */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold text-amber-100 mb-4"
        >
          {settings.welcomeTitle}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-amber-200/90 mb-8"
        >
          {settings.welcomeText}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToMenu}
          className="text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
          style={{ backgroundColor: settings.accentColor }}
        >
          تصفح القائمة
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
