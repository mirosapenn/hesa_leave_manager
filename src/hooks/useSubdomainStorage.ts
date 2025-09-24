import { useState, useEffect } from 'react';
import { useSubdomain } from './useSubdomain';

export const useSubdomainStorage = () => {
  const { currentSubdomain } = useSubdomain();
  const [storagePrefix, setStoragePrefix] = useState<string>('');

  useEffect(() => {
    if (currentSubdomain) {
      setStoragePrefix(`subdomain_${currentSubdomain}_`);
    } else {
      setStoragePrefix('');
    }
  }, [currentSubdomain]);

  const getItem = (key: string): string | null => {
    const fullKey = storagePrefix + key;
    return localStorage.getItem(fullKey);
  };

  const setItem = (key: string, value: string): void => {
    const fullKey = storagePrefix + key;
    localStorage.setItem(fullKey, value);
  };

  const removeItem = (key: string): void => {
    const fullKey = storagePrefix + key;
    localStorage.removeItem(fullKey);
  };

  const getJSON = <T>(key: string, defaultValue: T): T => {
    try {
      const item = getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error parsing JSON for key ${key}:`, error);
      return defaultValue;
    }
  };

  const setJSON = <T>(key: string, value: T): void => {
    setItem(key, JSON.stringify(value));
  };

  return {
    getItem,
    setItem,
    removeItem,
    getJSON,
    setJSON,
    storagePrefix,
    isSubdomainMode: !!currentSubdomain
  };
};
