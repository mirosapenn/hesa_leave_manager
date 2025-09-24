import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  Star,
  ArrowRight,
  Mail,
  Phone,
  Globe,
  // Download,
  Play,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';
import { englishToPersianNumbers } from '../utils/dateHelpers';

interface LandingPageProps {
  onEnterSystem: () => void;
  onNavigateToCustomerLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterSystem, onNavigateToCustomerLogin }) => {
  const { success: showSuccess } = useToast();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const features = [
    {
      icon: Users,
      title: 'مدیریت کارمندان',
      description: 'افزودن، ویرایش و مدیریت اطلاعات کارمندان با امکانات پیشرفته'
    },
    {
      icon: Calendar,
      title: 'ثبت مرخصی هوشمند',
      description: 'ثبت مرخصی‌های روزانه و ساعتی با تقویم فارسی و محاسبه خودکار'
    },
    {
      icon: BarChart3,
      title: 'گزارش‌گیری پیشرفته',
      description: 'تولید گزارش‌های تفصیلی و خروجی Excel با فرمت فارسی'
    },
    {
      icon: Shield,
      title: 'امنیت بالا',
      description: 'سیستم کاربری چندسطحه با لاگ‌گیری کامل فعالیت‌ها'
    },
    {
      icon: Clock,
      title: 'پشتیبانی ۲۴/۷',
      description: 'پشتیبانی فنی و آموزشی در تمام ساعات شبانه‌روز'
    },
    {
      icon: TrendingUp,
      title: 'بهینه‌سازی فرآیندها',
      description: 'کاهش زمان پردازش و افزایش بهره‌وری سازمانی'
    }
  ];

  const plans = [
    {
      name: 'پایه',
      price: '۵۰۰,۰۰۰',
      period: 'تومان - یکبار',
      features: [
        'تا ۵۰ کارمند',
        'ثبت مرخصی روزانه و ساعتی',
        'گزارش‌گیری پایه',
        'پشتیبانی ایمیلی',
        'بروزرسانی رایگان ۶ ماه'
      ],
      popular: false
    },
    {
      name: 'حرفه‌ای',
      price: '۱,۲۰۰,۰۰۰',
      period: 'تومان - یکبار',
      features: [
        'تا ۲۰۰ کارمند',
        'تمام امکانات پایه',
        'گزارش‌گیری پیشرفته',
        'پشتیبانی تلفنی',
        'بروزرسانی رایگان ۱ سال',
        'آموزش رایگان'
      ],
      popular: true
    },
    {
      name: 'سازمانی',
      price: '۲,۵۰۰,۰۰۰',
      period: 'تومان - یکبار',
      features: [
        'کارمند نامحدود',
        'تمام امکانات حرفه‌ای',
        'سفارشی‌سازی کامل',
        'پشتیبانی اختصاصی',
        'بروزرسانی رایگان ۲ سال',
        'نصب و راه‌اندازی رایگان'
      ],
      popular: false
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // شبیه‌سازی ارسال فرم
    showSuccess('پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setShowContactForm(false);
  };

  return (
    <div className="min-h-screen bg-white" style={{ direction: 'rtl' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 ml-2" />
                <span className="text-xl font-bold text-gray-900">سیستم مدیریت مرخصی حسا</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setShowContactForm(true)}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                تماس با ما
              </button>
              <button
                onClick={onEnterSystem}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                ورود به حساب کاربری
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              مدیریت مرخصی
              <span className="text-blue-600"> هوشمند</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              سیستم جامع مدیریت مرخصی کارکنان با رابط کاربری فارسی، گزارش‌گیری پیشرفته و امنیت بالا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onEnterSystem}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                شروع رایگان
              </button>
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
              >
                مشاوره رایگان
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ویژگی‌های کلیدی
            </h2>
            <p className="text-xl text-gray-600">
              همه چیزی که برای مدیریت مرخصی کارکنان نیاز دارید
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              پلان‌های قیمت‌گذاری
            </h2>
            <p className="text-xl text-gray-600">
              بسته مناسب سازمان خود را انتخاب کنید
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg p-8 relative ${
                plan.popular ? 'border-2 border-blue-500 transform scale-105' : 'border border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      محبوب‌ترین
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {englishToPersianNumbers(plan.price)}
                  </div>
                  <p className="text-gray-600">{plan.period}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setShowContactForm(true)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  خرید و دریافت کد فعال‌سازی
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                {englishToPersianNumbers('500+')}
              </div>
              <div className="text-blue-100">سازمان فعال</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                {englishToPersianNumbers('10,000+')}
              </div>
              <div className="text-blue-100">کارمند</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                {englishToPersianNumbers('99.9%')}
              </div>
              <div className="text-blue-100">آپتایم</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                {englishToPersianNumbers('24/7')}
              </div>
              <div className="text-blue-100">پشتیبانی</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            آماده شروع هستید؟
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            همین امروز سیستم مدیریت مرخصی خود را راه‌اندازی کنید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToCustomerLogin}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              ورود به حساب کاربری
            </button>
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
            >
              خرید و دریافت کد فعال‌سازی
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-blue-400 ml-2" />
                <span className="text-xl font-bold">سیستم مدیریت مرخصی حسا</span>
              </div>
              <p className="text-gray-400">
                راه‌حل هوشمند برای مدیریت مرخصی کارکنان
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">محصولات</h3>
              <ul className="space-y-2 text-gray-400">
                <li>مدیریت کارمندان</li>
                <li>ثبت مرخصی</li>
                <li>گزارش‌گیری</li>
                <li>پشتیبان‌گیری</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">پشتیبانی</h3>
              <ul className="space-y-2 text-gray-400">
                <li>مرکز راهنمایی</li>
                <li>آموزش</li>
                <li>تماس با ما</li>
                <li>گزارش مشکل</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">تماس با ما</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>ehsantaj@yahoo.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{englishToPersianNumbers('021-12345678')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>leave.finet.pro</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {englishToPersianNumbers('2025')} سیستم مدیریت مرخصی حسا. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">تماس با ما</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ایمیل
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره تماس
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  پیام
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="پیام خود را بنویسید..."
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ارسال پیام
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;