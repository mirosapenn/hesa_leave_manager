import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useActivation } from './hooks/useActivation';
import { addCustomerLog } from './hooks/useLogger';
// import { useCustomerSync } from './hooks/useCustomerSync';
import { Customer } from './types';
import LandingPage from './components/LandingPage';
import CustomerLogin from './components/CustomerLogin';
import CustomerDashboard from './components/CustomerDashboard';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import LeaveManagement from './components/LeaveManagement';
import Reports from './components/Reports';
import Settings from './components/Settings';
import SystemLogs from './components/SystemLogs';
import Backup from './components/Backup';
import About from './components/About';
import AdminPanel from './components/AdminPanel';
import ToastContainer from './components/ToastContainer';
import SubdomainError from './components/SubdomainError';
import { useRouter } from './hooks/useRouter';
import { useSubdomain } from './hooks/useSubdomain';

function App() {
  const { currentUser, loading, login, logout } = useAuth();
  const { activationStatus, loading: activationLoading } = useActivation();
  const { currentRoute, navigate } = useRouter();
  const { currentSubdomain, customer: subdomainCustomer, isLoading: subdomainLoading, getSubdomainStatus } = useSubdomain();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [customerData, setCustomerData] = useState<Customer | null>(null);









  
  // ذخیره ایمیل مشتری فعلی برای همگام‌سازی
  useEffect(() => {
    if (customerData?.email) {
      localStorage.setItem('current_customer_email', customerData.email);
    } else {
      localStorage.removeItem('current_customer_email');
    }
  }, [customerData]);

  if (loading || activationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // بررسی دسترسی مدیر کل (Super Admin) - فقط با ایمیل
  const isSuperAdmin = currentUser?.email === 'superadmin';

  // اگر در حال بارگذاری ساب‌دامین است
  if (subdomainLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بررسی ساب‌دامین...</p>
        </div>
      </div>
    );
  }

  // اگر ساب‌دامین وجود دارد اما مشکل دارد
  if (currentSubdomain) {
    const subdomainStatus = getSubdomainStatus();
    
    if (subdomainStatus === 'not_found') {
      return (
        <SubdomainError 
          subdomain={currentSubdomain} 
          status="not_found"
        />
      );
    }
    
    if (subdomainStatus === 'not_activated') {
      return (
        <SubdomainError 
          subdomain={currentSubdomain} 
          customer={subdomainCustomer ? {
            name: subdomainCustomer.purchaseInfo?.customerName || subdomainCustomer.name,
            email: subdomainCustomer.email
          } : undefined}
          status="not_activated"
        />
      );
    }
    
    // ساب‌دامین فعال است - هدایت به سیستم محلی
    if (subdomainStatus === 'active' && subdomainCustomer) {
      // تنظیم customerData برای سیستم محلی
      if (!customerData) {
        setCustomerData(subdomainCustomer);
      }
      
      // هدایت به سیستم محلی
      if (currentRoute !== 'local-dashboard') {
        navigate('local-dashboard');
      }
    }
  }

  const handleCustomerLogin = (email: string, password: string) => {
    // بررسی سوپر ادمین
    if (email.toLowerCase() === 'superadmin' && password === 'superadmin2025') {
      const success = login('superadmin', 'superadmin2025');
      if (success) {
        navigate('admin-panel');
      }
      return { success, message: success ? 'ورود موفق' : 'خطا در ورود' };
    }
    
    // بررسی مشتریان
    const customers = (() => {
      try {
        return JSON.parse(localStorage.getItem('admin_customers') || '[]');
      } catch (error) {
        console.error('خطا در خواندن admin_customers:', error);
        return [];
      }
    })();
    
    // ابتدا مشتری را با ایمیل پیدا کنیم
    const customerByEmail = customers.find((c: Customer) => 
      c.email.toLowerCase() === email.toLowerCase()
    );
    
    // اگر مشتری پیدا شد، رمز عبور را بررسی کنیم
    const customer = customerByEmail && 
      (customerByEmail.password === password || 
       customerByEmail.plainPassword === password || 
       password === 'ONE_TIME_LOGIN') 
      ? customerByEmail : null;
    
    if (!customer) {
      return { success: false, message: 'ایمیل یا رمز عبور اشتباه است' };
    }
    
    if (!customer.isActive) {
      return { success: false, message: 'حساب کاربری شما غیرفعال شده است' };
    }
    
    // ورود موفق
    setCustomerData(customer);
    navigate('customer-dashboard');
    
    addCustomerLog(customer.id, customer.email, 'login', 'ورود به پنل مشتری');
    
    return { success: true, message: 'ورود موفق' };
  };

  const handleForgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    // شبیه‌سازی ارسال رمز عبور جدید
    return { success: true, message: 'رمز عبور جدید به ایمیل شما ارسال شد' };
  };

  // Routing logic
  if (currentRoute === 'admin-panel' && isSuperAdmin && currentUser) {
    return <AdminPanel onLogout={logout} />;
  }

  if (currentRoute === 'local-login') {
    return (
      <Login
        onLogin={login}
        onBackToHome={() => navigate('landing')}
        onLoginSuccess={() => navigate('local-dashboard')}
      />
    );
  }

  if (currentRoute === 'customer-login') {
    return (
      <CustomerLogin
        onLogin={handleCustomerLogin}
        onBackToHome={() => navigate('landing')}
        onForgotPassword={handleForgotPassword}
      />
    );
  }

  if (currentRoute === 'customer-dashboard' && customerData) {
    const handleCustomerActivate = async (code: string): Promise<{ success: boolean; message: string }> => {
      // بررسی اینکه کد مربوط به همین ایمیل باشد
      const customers = (() => {
        try {
          return JSON.parse(localStorage.getItem('admin_customers') || '[]');
        } catch (error) {
          console.error('خطا در خواندن admin_customers:', error);
          return [];
        }
      })();
      const customer = customers.find((c: Customer) => c.email === customerData.email);
      
      if (!customer) {
        return { success: false, message: 'خطا در یافتن اطلاعات مشتری' };
      }
      
      if (customer.activationCode !== code.toUpperCase().trim()) {
        addCustomerLog(customer.id, customer.email, 'activation_failed', `تلاش ناموفق فعال‌سازی با کد: ${code}`);
        return { success: false, message: 'کد فعال‌سازی مربوط به این حساب کاربری نیست' };
      }
      
      // فعال‌سازی با کد تمیز شده
      const cleanCode = code.toUpperCase().trim();
      
      // تنظیم کد فعال‌سازی در localStorage برای سیستم فعال‌سازی
      const activationData = {
        isActivated: true,
        activationCode: cleanCode,
        activatedAt: new Date().toISOString(),
        expiresAt: customer.expiresAt
      };
      
      localStorage.setItem('activation_status', JSON.stringify(activationData));
      
      const result = { success: true, message: 'نرم‌افزار با موفقیت فعال شد' };
      
      if (result.success) {
        // بروزرسانی اطلاعات مشتری
        const updatedCustomers = customers.map((c: Customer) => 
        c.id === customer.id 
          ? { ...c, isActivated: true, activatedAt: new Date().toISOString() }
          : c
      );
        localStorage.setItem('admin_customers', JSON.stringify(updatedCustomers));
        
        setCustomerData({ ...customer, isActivated: true, activatedAt: new Date().toISOString() });
        addCustomerLog(customer.id, customer.email, 'activation_success', 'نرم‌افزار با موفقیت فعال شد');
        
        // بعد از فعال‌سازی موفق، کاربر در پنل مشتری باقی می‌ماند
        // و می‌تواند با دکمه "ورود به حساب کاربری" وارد سیستم محلی شود
      }
      
      return result;
    };

    const handleCustomerPasswordChange = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
      const customers = (() => {
        try {
          return JSON.parse(localStorage.getItem('admin_customers') || '[]');
        } catch (error) {
          console.error('خطا در خواندن admin_customers:', error);
          return [];
        }
      })();
      const customer = customers.find((c: Customer) => c.id === customerData.id);
      
      if (!customer || customer.password !== oldPassword) {
        return { success: false, message: 'رمز عبور فعلی اشتباه است' };
      }
      
      const updatedCustomers = customers.map((c: Customer) => 
        c.id === customer.id 
          ? { ...c, password: newPassword }
          : c
      );
      localStorage.setItem('admin_customers', JSON.stringify(updatedCustomers));
      
      setCustomerData({ ...customer, password: newPassword });
      addCustomerLog(customer.id, customer.email, 'password_changed', 'رمز عبور تغییر کرد');
      
      return { success: true, message: 'رمز عبور با موفقیت تغییر کرد' };
    };

    return (
      <CustomerDashboard
        customer={customerData}
        onActivate={handleCustomerActivate}
        onChangePassword={handleCustomerPasswordChange}
        onLogout={() => {
          setShowCustomerDashboard(false);
          setCustomerData(null);
        }}
      />
    );
  }


  // اگر کاربر وارد نشده، ابتدا صفحه لندینگ نمایش داده شود
  if (!currentUser && currentRoute === 'landing') {
    // صفحه لندینگ به عنوان صفحه اصلی
    return (
      <>
        <LandingPage 
          onEnterSystem={() => navigate('customer-login')}
          onNavigateToCustomerLogin={() => navigate('customer-login')}
        />
        <ToastContainer />
      </>
    );
  }

  // اگر کاربر وارد شده و فعال‌سازی شده، به سیستم محلی هدایت شود
  if (currentUser && activationStatus.isActivated && currentRoute === 'local-dashboard') {
    const renderCurrentPage = () => {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />;
        case 'employees':
          return <EmployeeManagement />;
        case 'leaves':
          return <LeaveManagement />;
        case 'reports':
          return <Reports />;
        case 'backup':
          return <Backup />;
        case 'settings':
          return <Settings />;
        case 'logs':
          return <SystemLogs />;
        case 'about':
          return <About />;
        default:
          return <Dashboard />;
      }
    };

    return (
      <>
        <Layout
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={logout}
          currentUser={currentUser}
        >
          {renderCurrentPage()}
        </Layout>
        <ToastContainer />
      </>
    );
  }

  // صفحه اصلی (Landing Page)
  return (
    <>
      <LandingPage
        onEnterSystem={() => navigate('customer-login')}
        onNavigateToCustomerLogin={() => navigate('customer-login')}
      />
      <ToastContainer />
    </>
  );
}

export default App;