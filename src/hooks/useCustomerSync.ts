import { useState, useEffect } from 'react';

interface Customer {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  isActivated: boolean;
  activationCode?: string;
  activatedAt?: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export const useCustomerSync = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // بارگذاری اطلاعات مشتریان
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    try {
      const savedCustomers = localStorage.getItem('admin_customers');
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading customers:', error);
      setLoading(false);
    }
  };

  // همگام‌سازی اطلاعات مشتری با سیستم فعال‌سازی
  const syncCustomerActivation = (customerId: string, activationData: { isActivated: boolean; activationCode?: string; activatedAt?: string; expiresAt?: string }) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === customerId 
        ? { 
            ...customer, 
            isActivated: activationData.isActivated,
            activationCode: activationData.activationCode,
            activatedAt: activationData.activatedAt,
            expiresAt: activationData.expiresAt
          } 
        : customer
    );
    
    setCustomers(updatedCustomers);
    localStorage.setItem('admin_customers', JSON.stringify(updatedCustomers));
    
    // همگام‌سازی با وضعیت فعال‌سازی سیستم اگر کاربر فعلی است
    const currentCustomerEmail = localStorage.getItem('current_customer_email');
    if (currentCustomerEmail) {
      const currentCustomer = updatedCustomers.find(c => c.email === currentCustomerEmail);
      if (currentCustomer && currentCustomer.id === customerId) {
        localStorage.setItem('activation_status', JSON.stringify(activationData));
      }
    }
    
    return updatedCustomers;
  };

  // افزودن مشتری جدید
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = {
      ...customer,
      id: Date.now().toString(),
    };
    
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem('admin_customers', JSON.stringify(updatedCustomers));
    
    return newCustomer;
  };

  // به‌روزرسانی اطلاعات مشتری
  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, ...updates } 
        : customer
    );
    
    setCustomers(updatedCustomers);
    localStorage.setItem('admin_customers', JSON.stringify(updatedCustomers));
    
    // همگام‌سازی با وضعیت فعال‌سازی سیستم اگر کاربر فعلی است
    const currentCustomerEmail = localStorage.getItem('current_customer_email');
    if (currentCustomerEmail) {
      const currentCustomer = updatedCustomers.find(c => c.email === currentCustomerEmail);
      if (currentCustomer && currentCustomer.id === customerId && updates.activationCode) {
        const activationData = {
          isActivated: updates.isActivated || currentCustomer.isActivated,
          activationCode: updates.activationCode,
          activatedAt: updates.activatedAt || currentCustomer.activatedAt,
          expiresAt: updates.expiresAt || currentCustomer.expiresAt
        };
        localStorage.setItem('activation_status', JSON.stringify(activationData));
      }
    }
    
    return updatedCustomers.find(c => c.id === customerId);
  };

  // حذف مشتری
  const deleteCustomer = (customerId: string) => {
    const updatedCustomers = customers.filter(customer => customer.id !== customerId);
    setCustomers(updatedCustomers);
    localStorage.setItem('admin_customers', JSON.stringify(updatedCustomers));
  };

  // دریافت مشتری با ایمیل
  const getCustomerByEmail = (email: string) => {
    return customers.find(customer => customer.email.toLowerCase() === email.toLowerCase());
  };

  // دریافت مشتری با کد فعال‌سازی
  const getCustomerByActivationCode = (code: string) => {
    return customers.find(customer => customer.activationCode === code);
  };

  return {
    customers,
    loading,
    syncCustomerActivation,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerByEmail,
    getCustomerByActivationCode,
    loadCustomers
  };
};