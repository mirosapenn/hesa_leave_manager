import { useState, useEffect, useCallback } from 'react';
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

  const getItem = useCallback((key: string): string | null => {
    const fullKey = storagePrefix + key;
    return localStorage.getItem(fullKey);
  }, [storagePrefix]);

  const setItem = useCallback((key: string, value: string): void => {
    const fullKey = storagePrefix + key;
    localStorage.setItem(fullKey, value);
  }, [storagePrefix]);

  const removeItem = useCallback((key: string): void => {
    const fullKey = storagePrefix + key;
    localStorage.removeItem(fullKey);
  }, [storagePrefix]);

  const getJSON = useCallback(<T>(key: string, defaultValue: T): T => {
    try {
      const item = getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error parsing JSON for key ${key}:`, error);
      return defaultValue;
    }
  }, [storagePrefix]);

  const setJSON = useCallback(<T>(key: string, value: T): void => {
    setItem(key, JSON.stringify(value));
  }, [storagePrefix]);

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
