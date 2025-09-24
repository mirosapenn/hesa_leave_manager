import { useState, useEffect } from 'react';
import { supabase, supabaseConfig } from '../lib/supabase';

interface ActivationStatus {
  isActivated: boolean;
  activationCode?: string;
  activatedAt?: string;
  expiresAt?: string;
}

// کدهای فعال‌سازی از localStorage خوانده می‌شوند و توسط سوپر ادمین مدیریت می‌شوند
const getValidActivationCodes = (): string[] => {
  try {
    const savedCodes = localStorage.getItem('admin_activation_codes');
    if (savedCodes) {
      return JSON.parse(savedCodes);
    }
  } catch (error) {
    console.error('خطا در خواندن کدهای فعال‌سازی:', error);
  }
  // در صورت نبود کدها، آرایه خالی برگردانده می‌شود
  return [];
};

// تولید شناسه منحصر به فرد برای دستگاه
const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('Device fingerprint', 10, 10);
  const canvasFingerprint = canvas.toDataURL();
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasFingerprint.slice(-50)
  ].join('|');
  
  // ساده‌سازی به hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // تبدیل به 32bit integer
  }
  return Math.abs(hash).toString(36);
};
export const useActivation = () => {
  const [activationStatus, setActivationStatus] = useState<ActivationStatus>({
    isActivated: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkActivationStatus();
  }, []);

  const checkActivationStatus = () => {
    try {
      const savedActivation = localStorage.getItem('activation_status');
      if (savedActivation) {
        const activation: ActivationStatus = (() => {
          try {
            return JSON.parse(savedActivation);
          } catch (error) {
            console.error('خطا در خواندن activation status:', error);
            return { isActivated: false };
          }
        })();
        
        // بررسی انقضا (اگر تاریخ انقضا تنظیم شده باشد)
        if (activation.expiresAt) {
          const now = new Date();
          const expiryDate = new Date(activation.expiresAt);
          if (now > expiryDate) {
            // کد منقضی شده - فقط وضعیت را به‌روز کن اما deactivate نکن
            // این به مشتری اجازه می‌دهد به پنل مشتری برود و کد جدید وارد کند
            setActivationStatus({
              ...activation,
              isActivated: false // فقط وضعیت فعال‌سازی را غیرفعال می‌کنیم
            });
            setLoading(false);
            return;
          }
        }
        
        setActivationStatus(activation);
      }
    } catch (error) {
      console.error('Error checking activation status:', error);
    }
    setLoading(false);
  };

  const validateActivationCode = (code: string): boolean => {
    // حذف فاصله‌ها و تبدیل به حروف بزرگ
    const cleanCode = code.trim().toUpperCase();
    const validCodes = getValidActivationCodes();
    return validCodes.includes(cleanCode);
  };

  const activate = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    setLoading(true);
    
    // اگر Supabase پیکربندی نشده باشد، مستقیماً از روش محلی استفاده کن
    if (!supabaseConfig.isConfigured) {
      console.warn('Supabase not configured, using local activation');
      setLoading(false);
      return activateLocally(cleanCode);
    }
    
    try {
      // تولید شناسه دستگاه
      const deviceFingerprint = generateDeviceFingerprint();
      
      // ارسال درخواست به Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('validate-activation', {
        body: {
          code: cleanCode,
          deviceFingerprint,
          userAgent: navigator.userAgent,
          ipAddress: 'client' // در محیط مرورگر نمی‌توان IP واقعی دریافت کرد
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        // fallback به روش محلی
        setLoading(false);
        return activateLocally(cleanCode);
      }

      if (data.success) {
        const activationData: ActivationStatus = {
          isActivated: true,
          activationCode: cleanCode,
          activatedAt: new Date().toISOString(),
          expiresAt: data.expiresAt
        };

        localStorage.setItem('activation_status', JSON.stringify(activationData));
        setActivationStatus(activationData);
        
        // ذخیره اطلاعات مشتری اگر موجود باشد
        if (data.customerEmail) {
          localStorage.setItem('customer_email', data.customerEmail);
        }
        
        setLoading(false);
        return {
          success: true,
          message: data.message || 'نرم‌افزار با موفقیت فعال شد'
        };
      } else {
        // نمایش پیام خطای مناسب
        // خطا در فعال‌سازی
        setLoading(false);
        return {
          success: false,
          message: data.message || 'خطا در فعال‌سازی'
        };
      }
    } catch (error) {
      console.error('Activation error:', error);
      // نمایش خطای مناسب به کاربر
      // خطا در فرآیند فعال‌سازی
      // fallback به روش محلی
      setLoading(false);
      return activateLocally(cleanCode);
    }
  };

  const activateLocally = (cleanCode: string): { success: boolean; message: string } => {
    if (!validateActivationCode(cleanCode)) {
      return {
        success: false,
        message: 'کد فعال‌سازی نامعتبر است'
      };
    }

    // بررسی اینکه کد قبلاً استفاده شده یا نه (در نسخه واقعی از API بررسی می‌شود)
    const usedCodes = (() => {
      try {
        return JSON.parse(localStorage.getItem('used_activation_codes') || '[]');
      } catch (error) {
        console.error('خطا در خواندن کدهای استفاده شده:', error);
        return [];
      }
    })();
    if (usedCodes.includes(cleanCode)) {
      return {
        success: false,
        message: 'این کد فعال‌سازی قبلاً استفاده شده است'
      };
    }

    // تعیین تاریخ انقضا بر اساس نوع کد
    let expiresAt: string | undefined;
    if (cleanCode.includes('TRIAL')) {
      // کدهای آزمایشی 1 روز اعتبار دارند
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 1);
      expiresAt = expiry.toISOString();
    }
    // کدهای ADMIN بدون انقضا هستند

    const activationData: ActivationStatus = {
      isActivated: true,
      activationCode: cleanCode,
      activatedAt: new Date().toISOString(),
      expiresAt
    };

    // ذخیره وضعیت فعال‌سازی
    localStorage.setItem('activation_status', JSON.stringify(activationData));
    
    // اضافه کردن کد به لیست کدهای استفاده شده
    const updatedUsedCodes = [...usedCodes, cleanCode];
    localStorage.setItem('used_activation_codes', JSON.stringify(updatedUsedCodes));

    setActivationStatus(activationData);

    return {
      success: true,
      message: 'نرم‌افزار با موفقیت فعال شد'
    };
  };

  const deactivate = () => {
    localStorage.removeItem('activation_status');
    setActivationStatus({ isActivated: false });
  };

  const getActivationInfo = () => {
    if (!activationStatus.isActivated) return null;

    const info = {
      code: activationStatus.activationCode,
      activatedAt: activationStatus.activatedAt,
      expiresAt: activationStatus.expiresAt,
      isExpired: false,
      daysRemaining: null as number | null,
      licenseType: 'نامشخص'
    };

    // تعیین نوع مجوز
    if (activationStatus.activationCode?.includes('TRIAL')) {
      info.licenseType = 'آزمایشی';
    } else if (activationStatus.activationCode?.includes('ADMIN')) {
      info.licenseType = 'مدیریت';
    }

    // محاسبه روزهای باقی‌مانده
    if (activationStatus.expiresAt) {
      const now = new Date();
      const expiry = new Date(activationStatus.expiresAt);
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      info.daysRemaining = Math.max(0, diffDays);
      info.isExpired = diffDays <= 0;
    }

    return info;
  };

  return {
    activationStatus,
    loading,
    activate,
    deactivate,
    getActivationInfo,
    checkActivationStatus
  };
};