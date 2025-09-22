// Safe localStorage utilities with error handling

export const safeJSONParse = <T>(jsonString: string | null, fallback: T): T => {
  if (!jsonString) return fallback;
  
  try {
    const parsed = JSON.parse(jsonString);
    return parsed !== null ? parsed : fallback;
  } catch (error) {
    console.error('خطا در تجزیه JSON:', error);
    return fallback;
  }
};

export const safeLocalStorageGet = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return safeJSONParse(item, fallback);
  } catch (error) {
    console.error(`خطا در خواندن localStorage برای کلید ${key}:`, error);
    return fallback;
  }
};

export const safeLocalStorageSet = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`خطا در نوشتن localStorage برای کلید ${key}:`, error);
    return false;
  }
};

export const safeLocalStorageRemove = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`خطا در حذف localStorage برای کلید ${key}:`, error);
    return false;
  }
};