/**
 * لوحة تحكم شاملة للأدمن
 * إدارة: المنتجات، الفئات، إعدادات الموقع
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, LogOut, Save, X, Upload,
  Settings, Package, Tags, Palette, Phone, MapPin, Clock,
  Eye, EyeOff, Lock, ImageIcon, RefreshCw,
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCategories } from '../context/CategoriesContext';
import { useSettings } from '../context/SettingsContext';
import type { Product } from '../data/products';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { settings, updateSettings, resetSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings'>('products');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  // حالات المنتجات
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [productPreview, setProductPreview] = useState('');
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', image: '', category: categories[0]?.id || 'juices',
  });

  // حالات الفئات
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '' });

  // حالات الإعدادات
  const [settingsForm, setSettingsForm] = useState(settings);
  const [showPassword, setShowPassword] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // التحقق من تسجيل الدخول
  if (sessionStorage.getItem('admin-auth') !== 'true') {
    navigate('/admin-login');
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    navigate('/');
  };

  // ===== رفع الصور =====
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('الرجاء اختيار ملف صورة'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('الحد الأقصى 2 ميجا'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ===== المنتجات =====
  const resetProductForm = () => {
    setProductForm({ name: '', description: '', price: '', image: '', category: categories[0]?.id || 'juices' });
    setProductPreview('');
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, description: p.description, price: String(p.price), image: p.image, category: p.category });
    setProductPreview(p.image);
    setIsAddingProduct(true);
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(productForm.price);
    if (!productForm.name || !price) return;
    const img = productForm.image || '/images/orange-juice.jpg';
    if (editingProduct) {
      updateProduct(editingProduct.id, { name: productForm.name, description: productForm.description, price, image: img, category: productForm.category });
    } else {
      addProduct({ name: productForm.name, description: productForm.description, price, image: img, category: productForm.category });
    }
    resetProductForm();
  };

  // ===== الفئات =====
  const resetCategoryForm = () => {
    setCategoryForm({ name: '', icon: '' });
    setEditingCategory(null);
    setIsAddingCategory(false);
  };

  const startEditCategory = (cat: { id: string; name: string; icon: string }) => {
    setEditingCategory(cat.id);
    setCategoryForm({ name: cat.name, icon: cat.icon });
    setIsAddingCategory(true);
  };

  const submitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    if (editingCategory) {
      updateCategory(editingCategory, { name: categoryForm.name, icon: categoryForm.icon });
    } else {
      addCategory({ name: categoryForm.name, icon: categoryForm.icon || '📦' });
    }
    resetCategoryForm();
  };

  // ===== الإعدادات =====
  const saveSettings = () => {
    updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const getCategoryName = (catId: string) => categories.find((c) => c.id === catId)?.name || catId;

  return (
    <div className="min-h-screen" style={{ backgroundColor: settings.bgColor }} dir="rtl">
      {/* رأس */}
      <header className="shadow-lg sticky top-0 z-50" style={{ backgroundColor: settings.primaryColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{settings.logoIcon}</span>
            <h1 className="text-xl font-bold text-amber-100">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-amber-200 hover:text-white text-sm">عرض الموقع</button>
            <button onClick={handleLogout} className="flex items-center gap-1 text-red-300 hover:text-red-200 text-sm">
              <LogOut className="w-4 h-4" />خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* تبويب الأقسام */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'products' as const, label: 'المنتجات', icon: Package },
            { id: 'categories' as const, label: 'الفئات', icon: Tags },
            { id: 'settings' as const, label: 'إعدادات الموقع', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? settings.primaryColor : 'white',
                color: activeTab === tab.id ? '#FFECB3' : settings.secondaryColor,
                border: `1px solid ${activeTab === tab.id ? settings.primaryColor : '#D7CCC8'}`,
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ====== قسم المنتجات ====== */}
        {activeTab === 'products' && (
          <div>
            {!isAddingProduct && (
              <button
                onClick={() => setIsAddingProduct(true)}
                className="mb-6 flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Plus className="w-5 h-5" />
                إضافة منتج جديد
              </button>
            )}

            <AnimatePresence>
              {isAddingProduct && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200 mb-8 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold" style={{ color: settings.primaryColor }}>
                      {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
                    </h2>
                    <button onClick={resetProductForm} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={submitProduct} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>اسم المنتج *</label>
                        <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="مثال: عصير برتقال" className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>السعر ({settings.currencySymbol}) *</label>
                        <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="مثال: 5000" className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" required min="0" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>الوصف</label>
                      <input type="text" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="وصف قصير..." className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>الفئة *</label>
                        <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl">
                          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>رابط الصورة</label>
                        <input type="text" value={productForm.image} onChange={(e) => { setProductForm({ ...productForm, image: e.target.value }); setProductPreview(e.target.value); }} placeholder="رابط الصورة" className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: settings.secondaryColor }}>أو ارفع صورة من جهازك</label>
                      <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => handleImageUpload(e, (url) => { setProductPreview(url); setProductForm((p) => ({ ...p, image: url })); })} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-amber-300 rounded-xl text-amber-700 transition-colors">
                        <Upload className="w-4 h-4" />اختيار صورة (أقصى 2 ميجا)
                      </button>
                    </div>
                    {productPreview && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative inline-block">
                        <p className="text-sm font-medium mb-2" style={{ color: settings.secondaryColor }}>معاينة:</p>
                        <img src={productPreview} alt="معاينة" className="w-40 h-40 object-cover rounded-xl border border-amber-200" onError={() => setProductPreview('')} />
                        <button type="button" onClick={() => { setProductPreview(''); setProductForm((p) => ({ ...p, image: '' })); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">✕</button>
                      </motion.div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-medium transition-colors hover:opacity-90" style={{ backgroundColor: settings.primaryColor }}>
                        <Save className="w-4 h-4" />
                        {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                      </button>
                      <button type="button" onClick={resetProductForm} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium">إلغاء</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* جدول المنتجات */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
              <div className="p-4 border-b border-amber-100"><h2 className="text-lg font-bold" style={{ color: settings.primaryColor }}>قائمة المنتجات ({products.length})</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-50">
                    <tr>
                      <th className="text-right px-4 py-3 text-sm font-bold" style={{ color: settings.secondaryColor }}>المنتج</th>
                      <th className="text-right px-4 py-3 text-sm font-bold" style={{ color: settings.secondaryColor }}>الفئة</th>
                      <th className="text-right px-4 py-3 text-sm font-bold" style={{ color: settings.secondaryColor }}>السعر</th>
                      <th className="text-center px-4 py-3 text-sm font-bold" style={{ color: settings.secondaryColor }}>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-amber-50 hover:bg-amber-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/orange-juice.jpg'; }} />
                            <div>
                              <p className="font-medium text-sm" style={{ color: settings.primaryColor }}>{p.name}</p>
                              <p className="text-xs text-[#8D6E63] truncate max-w-[200px]">{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: settings.secondaryColor }}>{getCategoryName(p.category)}</td>
                        <td className="px-4 py-3 font-bold" style={{ color: settings.accentColor }}>{p.price.toLocaleString()} {settings.currencySymbol}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => startEditProduct(p)} className="p-2 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-amber-700" /></button>
                            {deleteProductId === p.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => { deleteProduct(p.id); setDeleteProductId(null); }} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs">تأكيد</button>
                                <button onClick={() => setDeleteProductId(null)} className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg text-xs">إلغاء</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteProductId(p.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {products.length === 0 && <div className="text-center py-12 text-[#8D6E63]">لا توجد منتجات</div>}
            </div>
          </div>
        )}

        {/* ====== قسم الفئات ====== */}
        {activeTab === 'categories' && (
          <div>
            {!isAddingCategory && (
              <button onClick={() => setIsAddingCategory(true)} className="mb-6 flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-medium transition-colors hover:opacity-90" style={{ backgroundColor: settings.accentColor }}>
                <Plus className="w-5 h-5" />إضافة فئة جديدة
              </button>
            )}

            <AnimatePresence>
              {isAddingCategory && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200 mb-8 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold" style={{ color: settings.primaryColor }}>{editingCategory ? 'تعديل فئة' : 'إضافة فئة جديدة'}</h2>
                    <button onClick={resetCategoryForm} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={submitCategory} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>اسم الفئة *</label>
                        <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="مثال: حلويات" className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>الأيقونة (اموجي)</label>
                        <input type="text" value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} placeholder="مثال: 🍦" className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-medium transition-colors hover:opacity-90" style={{ backgroundColor: settings.primaryColor }}>
                        <Save className="w-4 h-4" />
                        {editingCategory ? 'حفظ' : 'إضافة'}
                      </button>
                      <button type="button" onClick={resetCategoryForm} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium">إلغاء</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
              <div className="p-4 border-b border-amber-100"><h2 className="text-lg font-bold" style={{ color: settings.primaryColor }}>الفئات ({categories.length})</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-50">
                    <tr>
                      <th className="text-right px-4 py-3 text-sm font-bold" style={{ color: settings.secondaryColor }}>الأيقونة</th>
                      <th className="text-right px-4 py-3 text-sm font-bold" style={{ color: settings.secondaryColor }}>اسم الفئة</th>
                      <th className="text-right px-4 py-3 text-sm font-bold" style={{ color: settings.secondaryColor }}>عدد المنتجات</th>
                      <th className="text-center px-4 py-3 text-sm font-bold" style={{ color: settings.secondaryColor }}>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id} className="border-b border-amber-50 hover:bg-amber-50/50">
                        <td className="px-4 py-3 text-2xl">{cat.icon}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: settings.primaryColor }}>{cat.name}</td>
                        <td className="px-4 py-3" style={{ color: settings.secondaryColor }}>{products.filter((p) => p.category === cat.id).length}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => startEditCategory(cat)} className="p-2 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-amber-700" /></button>
                            {deleteCategoryId === cat.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => { deleteCategory(cat.id); setDeleteCategoryId(null); }} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs">تأكيد</button>
                                <button onClick={() => setDeleteCategoryId(null)} className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg text-xs">إلغاء</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteCategoryId(cat.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====== قسم الإعدادات ====== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: settings.primaryColor }}>
                <Settings className="w-5 h-5" />
                إعدادات الموقع
              </h2>
              {settingsSaved && <span className="text-green-600 text-sm font-medium">✅ تم الحفظ بنجاح!</span>}
            </div>

            <div className="space-y-6">
              {/* اسم المحل */}
              <div className="border-b border-amber-100 pb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: settings.primaryColor }}>
                  <Package className="w-4 h-4" />
                  معلومات المحل
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>اسم المحل</label>
                    <input type="text" value={settingsForm.siteName} onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>العنوان الفرعي</label>
                    <input type="text" value={settingsForm.siteSubtitle} onChange={(e) => setSettingsForm({ ...settingsForm, siteSubtitle: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>عنوان الترحيب</label>
                    <input type="text" value={settingsForm.welcomeTitle} onChange={(e) => setSettingsForm({ ...settingsForm, welcomeTitle: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>نص الترحيب</label>
                    <input type="text" value={settingsForm.welcomeText} onChange={(e) => setSettingsForm({ ...settingsForm, welcomeText: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>الأيقونة (اموجي)</label>
                    <input type="text" value={settingsForm.logoIcon} onChange={(e) => setSettingsForm({ ...settingsForm, logoIcon: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                </div>
              </div>

              {/* الألوان */}
              <div className="border-b border-amber-100 pb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: settings.primaryColor }}>
                  <Palette className="w-4 h-4" />
                  الألوان والثيم
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { key: 'primaryColor' as const, label: 'اللون الرئيسي' },
                    { key: 'secondaryColor' as const, label: 'اللون الثانوي' },
                    { key: 'accentColor' as const, label: 'لون الأزرار' },
                    { key: 'bgColor' as const, label: 'لون الخلفية' },
                  ].map((color) => (
                    <div key={color.key}>
                      <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>{color.label}</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={settingsForm[color.key]} onChange={(e) => setSettingsForm({ ...settingsForm, [color.key]: e.target.value })} className="w-10 h-10 rounded-lg border border-amber-300 cursor-pointer" />
                        <input type="text" value={settingsForm[color.key]} onChange={(e) => setSettingsForm({ ...settingsForm, [color.key]: e.target.value })} className="flex-1 px-2 py-1 border border-amber-300 rounded-lg text-sm bg-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* الصورة الخلفية */}
              <div className="border-b border-amber-100 pb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: settings.primaryColor }}>
                  <ImageIcon className="w-4 h-4" />
                  صورة الخلفية
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <input type="file" ref={heroFileRef} accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setSettingsForm({ ...settingsForm, heroImage: url }))} className="hidden" />
                  <button type="button" onClick={() => heroFileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-amber-300 rounded-xl text-amber-700 transition-colors">
                    <Upload className="w-4 h-4" />ارفع صورة خلفية
                  </button>
                  {settingsForm.heroImage && (
                    <div className="relative">
                      <img src={settingsForm.heroImage} alt="خلفية" className="w-40 h-24 object-cover rounded-xl border border-amber-200" />
                      <button onClick={() => setSettingsForm({ ...settingsForm, heroImage: '' })} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">✕</button>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>أو رابط الصورة</label>
                  <input type="text" value={settingsForm.heroImage} onChange={(e) => setSettingsForm({ ...settingsForm, heroImage: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                </div>
              </div>

              {/* التواصل */}
              <div className="border-b border-amber-100 pb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: settings.primaryColor }}>
                  <Phone className="w-4 h-4" />
                  معلومات التواصل
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1" style={{ color: settings.secondaryColor }}><Phone className="w-3 h-3" />رقم الهاتف</label>
                    <input type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1" style={{ color: settings.secondaryColor }}><Phone className="w-3 h-3" />رقم الواتساب (مع الرمز)</label>
                    <input type="text" value={settingsForm.whatsappNumber} onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })} placeholder="963937296510" className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1" style={{ color: settings.secondaryColor }}><MapPin className="w-3 h-3" />العنوان</label>
                    <input type="text" value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1" style={{ color: settings.secondaryColor }}><Clock className="w-3 h-3" />ساعات العمل</label>
                    <input type="text" value={settingsForm.workingHours} onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                </div>
              </div>

              {/* العملة وكلمة المرور */}
              <div className="border-b border-amber-100 pb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: settings.primaryColor }}>
                  <Lock className="w-4 h-4" />
                  العملة والأمان
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>اسم العملة</label>
                    <input type="text" value={settingsForm.currency} onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: settings.secondaryColor }}>رمز العملة</label>
                    <input type="text" value={settingsForm.currencySymbol} onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1" style={{ color: settings.secondaryColor }}><Lock className="w-3 h-3" />كلمة مرور الأدمن</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={settingsForm.adminPassword} onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })} className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" dir="rtl" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار الحفظ */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={saveSettings} className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold transition-colors hover:opacity-90" style={{ backgroundColor: settings.primaryColor }}>
                  <Save className="w-5 h-5" />
                  حفظ الإعدادات
                </button>
                <button onClick={() => setSettingsForm(settings)} className="flex items-center gap-2 px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  إلغاء التعديلات
                </button>
                <button onClick={() => { if (confirm('هل أنت متأكد من إعادة الإعدادات الافتراضية؟')) { resetSettings(); setSettingsForm(settings); } }} className="flex items-center gap-2 px-5 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  إعادة الإعدادات الافتراضية
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
