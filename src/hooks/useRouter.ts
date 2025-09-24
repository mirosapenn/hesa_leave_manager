import { useState, useEffect } from 'react';

export type Route = 
  | 'landing'
  | 'customer-login'
  | 'customer-dashboard'
  | 'local-login'
  | 'local-dashboard'
  | 'admin-panel';

export const useRouter = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('landing');

  useEffect(() => {
    // بررسی URL و تنظیم route مناسب
    const path = window.location.pathname;
    
    if (path === '/login') {
      setCurrentRoute('local-login');
    } else if (path === '/customer-login') {
      setCurrentRoute('customer-login');
    } else if (path === '/customer-dashboard') {
      setCurrentRoute('customer-dashboard');
    } else if (path === '/admin-panel') {
      setCurrentRoute('admin-panel');
    } else if (path === '/dashboard') {
      setCurrentRoute('local-dashboard');
    } else {
      setCurrentRoute('landing');
    }
  }, []);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    
    // تغییر URL بدون reload
    const routeMap: Record<Route, string> = {
      'landing': '/',
      'customer-login': '/customer-login',
      'customer-dashboard': '/customer-dashboard',
      'local-login': '/login',
      'local-dashboard': '/dashboard',
      'admin-panel': '/admin-panel'
    };
    
    window.history.pushState({}, '', routeMap[route]);
  };

  return {
    currentRoute,
    navigate
  };
};
