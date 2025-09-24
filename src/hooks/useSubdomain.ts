import { useState, useEffect } from 'react';
import { Customer } from '../types';

export const useSubdomain = () => {
  const [currentSubdomain, setCurrentSubdomain] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تشخیص ساب‌دامین از URL یا query parameter
    const hostname = window.location.hostname;
    const port = window.location.port;
    const urlParams = new URLSearchParams(window.location.search);
    const subdomainParam = urlParams.get('subdomain');
    
    let subdomain: string | null = null;
    
    // اولویت 1: Query parameter (برای تست محلی)
    if (subdomainParam) {
      subdomain = subdomainParam;
    }
    // اولویت 2: Port برای localhost (برای تست محلی)
    else if ((hostname === 'localhost' || hostname === '127.0.0.1') && port && port !== '3000' && port !== '5000') {
      subdomain = port;
    }
    // اولویت 3: IP مستقیم (نباید ساب‌دامین باشد)
    else if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      // IP مستقیم - ساب‌دامین نیست
      setIsLoading(false);
      return;
    }
    // اولویت 4: Subdomain برای production (finet.pro)
    else if (hostname.endsWith('.finet.pro')) {
      const hostSubdomain = hostname.split('.')[0];
      if (hostSubdomain && hostSubdomain !== 'www') {
        subdomain = hostSubdomain;
      }
    }
    // اولویت 5: دامین اصلی finet.pro
    else if (hostname === 'finet.pro' || hostname === 'www.finet.pro') {
      // دامین اصلی - ساب‌دامین نیست
      setIsLoading(false);
      return;
    }
    
    if (subdomain) {
      setCurrentSubdomain(subdomain);
      checkSubdomainActivation(subdomain);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkSubdomainActivation = async (subdomain: string) => {
    try {
      // بررسی مشتریان برای یافتن ساب‌دامین
      const customers = (() => {
        try {
          return JSON.parse(localStorage.getItem('admin_customers') || '[]');
        } catch (error) {
          console.error('Error parsing admin_customers:', error);
          return [];
        }
      })();

      const foundCustomer = customers.find((c: Customer) => c.subdomain === subdomain);
      
      if (!foundCustomer) {
        setCustomer(null);
        setIsLoading(false);
        return;
      }

      if (!foundCustomer.isActivated) {
        setCustomer(foundCustomer);
        setIsLoading(false);
        return;
      }

      // مشتری فعال است
      setCustomer(foundCustomer);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking subdomain activation:', error);
      setIsLoading(false);
    }
  };

  const isSubdomainActive = () => {
    return customer?.isActivated || false;
  };

  const getSubdomainStatus = () => {
    if (!currentSubdomain) return 'not_subdomain';
    if (!customer) return 'not_found';
    if (!customer.isActivated) return 'not_activated';
    return 'active';
  };

  return {
    currentSubdomain,
    customer,
    isLoading,
    isSubdomainActive,
    getSubdomainStatus,
    checkSubdomainActivation
  };
};
