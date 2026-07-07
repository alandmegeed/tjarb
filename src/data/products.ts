/**
 * ملف بيانات المنتجات الافتراضية
 * الفئات تؤخذ الآن من CategoriesContext
 */

export type CategoryId = 'all' | string;

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
  note: string;
}

// الفئات الافتراضية (قبل إضافة السياق)
export const defaultCategories = [
  { id: 'juices', name: 'عصائر طازجة', icon: '🍹' },
  { id: 'shisha', name: 'أراكيل', icon: '💨' },
  { id: 'drinks', name: 'مشروبات', icon: '☕' },
];

// المنتجات الافتراضية (قبل إضافة السياق)
export const defaultProducts: Product[] = [
  { id: 1, name: 'عصير برتقال طازج', description: 'عصير برتقال طبيعي 100% بدون إضافات', price: 5000, image: '/images/orange-juice.jpg', category: 'juices' },
  { id: 2, name: 'عصير مانجو', description: 'عصير مانجو طازج ومنعش', price: 6000, image: '/images/mango-juice.jpg', category: 'juices' },
  { id: 3, name: 'عصير فراولة', description: 'عصير فراولة طازج مع قطع الفراولة', price: 6000, image: '/images/strawberry-juice.jpg', category: 'juices' },
  { id: 4, name: 'عصير ليمون ونعناع', description: 'عصير ليمون منعش مع أوراق النعناع الطازجة', price: 4000, image: '/images/orange-juice.jpg', category: 'juices' },
  { id: 5, name: 'عصير أفوكادو', description: 'عصير أفوكادو كريمي مع الحليب', price: 7000, image: '/images/mango-juice.jpg', category: 'juices' },
  { id: 6, name: 'عصير بطيخ', description: 'عصير بطيخ منعش ومثالي للصيف', price: 5000, image: '/images/strawberry-juice.jpg', category: 'juices' },
  { id: 7, name: 'أراكيلة تفاح', description: 'نكهة التفاح الكلاسيكية الأصلية', price: 10000, image: '/images/shisha-apple.jpg', category: 'shisha' },
  { id: 8, name: 'أراكيلة نعناع', description: 'نكهة النعناع المنعشة والقوية', price: 10000, image: '/images/shisha-mint.jpg', category: 'shisha' },
  { id: 9, name: 'أراكيلة عنب', description: 'نكهة العنب الحلوة والمميزة', price: 10000, image: '/images/shisha-grape.jpg', category: 'shisha' },
  { id: 10, name: 'أراكيلة تفاحتين', description: 'مزيج التفاح الأخضر والأحمر', price: 12000, image: '/images/shisha-apple.jpg', category: 'shisha' },
  { id: 11, name: 'أراكيلة ليمون ونعناع', description: 'مزيج منعش من الليمون والنعناع', price: 11000, image: '/images/shisha-mint.jpg', category: 'shisha' },
  { id: 12, name: 'أراكيلة مشكل', description: 'مزيج خاص من عدة نكهات', price: 13000, image: '/images/shisha-grape.jpg', category: 'shisha' },
  { id: 13, name: 'قهوة لاتيه', description: 'قهوة لاتيه مع رسم فني على الوجه', price: 4000, image: '/images/coffee-latte.jpg', category: 'drinks' },
  { id: 14, name: 'قهوة مثلجة', description: 'قهوة باردة مع حليب وثلج', price: 5000, image: '/images/iced-coffee.jpg', category: 'drinks' },
  { id: 15, name: 'شاي أخضر', description: 'شاي أخضر طبيعي مع النعناع', price: 3000, image: '/images/hot-tea.jpg', category: 'drinks' },
  { id: 16, name: 'كابتشينو', description: 'كابتشينو إيطالي أصيل', price: 4000, image: '/images/coffee-latte.jpg', category: 'drinks' },
  { id: 17, name: 'موكا', description: 'قهوة موكا مع الشوكولاتة', price: 5000, image: '/images/iced-coffee.jpg', category: 'drinks' },
  { id: 18, name: 'شاي مغربي', description: 'شاي مغربي بالنعناع الطازج', price: 3000, image: '/images/hot-tea.jpg', category: 'drinks' },
];
