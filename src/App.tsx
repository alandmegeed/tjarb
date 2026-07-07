/**
 * المكون الرئيسي للتطبيق
 * يجمع جميع المكونات والسياقات
 */

import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { SettingsProvider } from './context/SettingsContext';
import { CategoriesProvider } from './context/CategoriesContext';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <SettingsProvider>
      <CategoriesProvider>
        <ProductsProvider>
          <CartProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </HashRouter>
          </CartProvider>
        </ProductsProvider>
      </CategoriesProvider>
    </SettingsProvider>
  );
}

export default App;
