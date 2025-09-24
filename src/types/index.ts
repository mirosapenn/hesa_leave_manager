export interface Employee {
  id: string;
  name: string;
  last_name: string;
  employee_id: string;
  position: string;
  created_at: string;
}

export interface Leave {
  id: string;
  employee_id: string;
  type: 'daily' | 'hourly';
  leave_category: 'medical' | 'entitled';
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  duration: number; // روز یا ساعت
  created_at: string;
  updated_at?: string;
  is_modified: boolean;
  created_by: string;
  updated_by?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  password: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface LogEntry {
  id: string;
  user_id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  entity_type: 'employee' | 'leave' | 'user' | 'settings';
  entity_id?: string;
  details: string;
  timestamp: string;
}

export interface Settings {
  id: string;
  annual_leave_limit: number;
  created_at: string;
  updated_at: string;
}

export type LeaveType = 'daily' | 'hourly';
export type LeaveCategory = 'medical' | 'entitled';

// Customer interface compatible with current usage
export interface Customer {
  id: string;
  activationCode: string;
  password: string;  // پسورد به صورت plain text برای super admin
  plainPassword?: string;  // سازگاری با کد قدیمی
  licenseType: 'admin' | 'trial';
  planType: 'basic' | 'professional' | 'enterprise';  // نوع پلان
  email: string;
  name: string;  // نام مشتری
  organization?: string;
  phone?: string;
  notes?: string;
  subdomain?: string;  // ساب‌دامین منحصر به فرد
  subdomainUrl?: string;  // URL کامل ساب‌دامین
  subdomainChangedAt?: string;  // آخرین تغییر ساب‌دامین
  purchaseInfo?: {
    customerName?: string;
    organization?: string;
    phone?: string;
    notes?: string;
  };
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  isActivated: boolean;  // وضعیت فعال‌سازی
  activatedAt?: string;  // تاریخ فعال‌سازی
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
  lastActivity?: string;
}