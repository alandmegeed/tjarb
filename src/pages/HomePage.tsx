/**
 * الصفحة الرئيسية للموقع
 * تعرض المنتجات والسلة
 * تستخدم الفئات والإعدادات من السياقات
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import Footer from '../components/Footer';
import { useProducts } from '../context/ProductsContext';
import { useCategories } from '../context/CategoriesContext';
import { useSettings } from '../context/SettingsContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { settings } = useSettings();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <div className="min-h-screen" style={{ backgroundColor: settings.bgColor }} dir="rtl">
      {/* رأس الصفحة */}
      <Header />

      {/* البانر الرئيسي */}
      <Hero />

      {/* قسم القائمة */}
      <section id="menu-section" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* عنوان القسم */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: settings.primaryColor }}>
              قائمة المنتجات
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: settings.secondaryColor }}>
              اختر من تشكيلتنا الواسعة من العصائر الطازجة والأراكيل الفاخرة
              والمشروبات الساخنة
            </p>
          </motion.div>

          {/* أزرار تصفية الفئات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10"
          >
            <button
              onClick={() => setActiveCategory('all')}
              className="px-5 py-2.5 rounded-full font-medium transition-all duration-200 border"
              style={{
                backgroundColor: activeCategory === 'all' ? settings.primaryColor : 'white',
                color: activeCategory === 'all' ? '#FFECB3' : settings.secondaryColor,
                borderColor: activeCategory === 'all' ? settings.primaryColor : '#D7CCC8',
              }}
            >
              الكل
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="px-5 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2 border"
                style={{
                  backgroundColor: activeCategory === category.id ? settings.primaryColor : 'white',
                  color: activeCategory === category.id ? '#FFECB3' : settings.secondaryColor,
                  borderColor: activeCategory === category.id ? settings.primaryColor : '#D7CCC8',
                }}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* شبكة المنتجات */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </motion.div>

          {/* رسالة عند عدم وجود منتجات */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: settings.secondaryColor }}>
                لا توجد منتجات في هذه الفئة
              </p>
            </div>
          )}
        </div>
      </section>

      {/* تذييل الصفحة */}
      <Footer />

      {/* سلة المشتريات */}
      <Cart />

      {/* زر الدخول للأدمن (مخفي) */}
      <button
        onClick={() => navigate('/admin-login')}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 text-amber-400"
        style={{ backgroundColor: settings.primaryColor }}
        title="لوحة التحكم"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
