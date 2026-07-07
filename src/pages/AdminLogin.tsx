/**
 * صفحة تسجيل دخول الأدمن
 * كلمة المرور مأخوذة من الإعدادات
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (password === settings.adminPassword) {
        sessionStorage.setItem('admin-auth', 'true');
        navigate('/admin');
      } else {
        setError('كلمة المرور غير صحيحة!');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 w-full max-w-md shadow-2xl"
        style={{ backgroundColor: settings.bgColor }}
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <span className="text-3xl">{settings.logoIcon}</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: settings.primaryColor }}>
            لوحة تحكم {settings.siteName}
          </h1>
          <p className="text-sm mt-1" style={{ color: settings.secondaryColor }}>
            تسجيل دخول الأدمن فقط
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: settings.secondaryColor }}>
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full pr-10 pl-10 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-[#3E2723]"
                dir="rtl"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mb-4 text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-sm transition-colors hover:opacity-70"
          style={{ color: settings.secondaryColor }}
        >
          ← العودة للموقع
        </button>
      </motion.div>
    </div>
  );
}
