import React from 'react';
import { AlertTriangle, Mail, RefreshCw } from 'lucide-react';

interface SubdomainErrorProps {
  subdomain: string;
  customer?: {
    name: string;
    email: string;
  } | null;
  status: 'not_found' | 'not_activated';
}

const SubdomainError: React.FC<SubdomainErrorProps> = ({ subdomain, customer, status }) => {
  const handleContactSupport = () => {
    const subject = encodeURIComponent('مشکل در دسترسی به ساب‌دامین');
    const body = encodeURIComponent(`
سلام،

من نمی‌توانم به ساب‌دامین ${subdomain} دسترسی پیدا کنم.

${status === 'not_found' 
  ? 'به نظر می‌رسد این ساب‌دامین وجود ندارد.'
  : 'به نظر می‌رسد این ساب‌دامین فعال نشده است.'
}

لطفاً راهنمایی کنید.

با تشکر
    `);
    
    window.open(`mailto:ehsantaj@yahoo.com?subject=${subject}&body=${body}`);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4" style={{ direction: 'rtl' }}>
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'not_found' ? 'ساب‌دامین یافت نشد' : 'ساب‌دامین غیرفعال'}
          </h1>
          <p className="text-gray-600 mb-4">
            {status === 'not_found' 
              ? `ساب‌دامین "${subdomain}" در سیستم یافت نشد.`
              : `ساب‌دامین "${subdomain}" هنوز فعال نشده است.`
            }
          </p>
        </div>

        {customer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">اطلاعات مشتری:</h3>
            <p className="text-sm text-blue-800">
              <strong>نام:</strong> {customer.name}
            </p>
            <p className="text-sm text-blue-800">
              <strong>ایمیل:</strong> {customer.email}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleContactSupport}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            تماس با پشتیبانی
          </button>
          
          <button
            onClick={handleRefresh}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            تلاش مجدد
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            برای فعال‌سازی یا تمدید لایسنس خود، با پشتیبانی تماس بگیرید:
          </p>
          <p className="text-sm text-blue-600 font-medium mt-1">
            ehsantaj@yahoo.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubdomainError;
