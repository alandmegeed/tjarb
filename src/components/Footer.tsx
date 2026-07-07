/**
 * مكون تذييل الصفحة
 * قابل للتعديل من الإعدادات
 */

import { MapPin, Phone, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer style={{ backgroundColor: '#2D1B14' }} className="text-amber-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات المقهى */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{settings.logoIcon}</span>
              <h3 className="text-xl font-bold text-amber-100">
                {settings.siteName}
              </h3>
            </div>
            <p className="text-sm leading-relaxed">
              وجهتك المثالية للاستمتاع بأفضل العصائر الطازجة، الأراكيل الفاخرة،
              والمشروبات الساخنة في أجواء مريحة وفاخرة.
            </p>
          </div>

          {/* معلومات التواصل */}
          <div>
            <h4 className="text-lg font-bold text-amber-100 mb-4">
              تواصل معنا
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-sm">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span className="text-sm">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-sm">{settings.workingHours}</span>
              </div>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-lg font-bold text-amber-100 mb-4">
              روابط سريعة
            </h4>
            <div className="space-y-2">
              <a
                href="#menu-section"
                className="block text-sm hover:text-amber-400 transition-colors"
              >
                قائمة المنتجات
              </a>
              <a
                href="#"
                className="block text-sm hover:text-amber-400 transition-colors"
              >
                عن المقهى
              </a>
              <a
                href="#"
                className="block text-sm hover:text-amber-400 transition-colors"
              >
                تواصل معنا
              </a>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="mt-8 pt-6 border-t border-amber-900/50 text-center text-sm">
          <p>© 2025 {settings.siteName}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
