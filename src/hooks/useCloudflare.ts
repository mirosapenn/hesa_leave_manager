import { useState } from 'react';
import { createDNSRecordProxy, checkDNSRecordProxy, setupCompleteDNSProxy } from '../utils/cloudflareProxy';

interface CloudflareConfig {
  apiKey: string;
  zoneId: string;
  domain: string;
}

export const useCloudflare = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تنظیمات Cloudflare
  const config: CloudflareConfig = {
    apiKey: '9222e96d38935c8777393f430748b0af06110',
    zoneId: 'd873f874ce4da55f7b7e2384441a9620',
    domain: 'finet.pro'
  };

  // دریافت Zone ID برای دامین (حالا مستقیماً از config استفاده می‌کنیم)
  const getZoneId = async (): Promise<string | null> => {
    return config.zoneId;
  };

  // ایجاد DNS Record
  const createDNSRecord = async (name: string, type: string, content: string, proxied: boolean = true): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await createDNSRecordProxy(name, type, content, proxied);
      if (!result) {
        throw new Error('خطا در ایجاد DNS Record');
      }
      return result;
    } catch (error) {
      console.error('Error creating DNS record:', error);
      setError(error instanceof Error ? error.message : 'خطا در ایجاد DNS Record');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ایجاد ساب‌دامین
  const createSubdomain = async (subdomain: string, serverIP: string): Promise<boolean> => {
    const fullName = `${subdomain}.${config.domain}`;
    return await createDNSRecord(fullName, 'A', serverIP, true);
  };

  // ایجاد Wildcard CNAME
  const createWildcardCNAME = async (): Promise<boolean> => {
    return await createDNSRecord(`*.${config.domain}`, 'CNAME', config.domain, true);
  };

  // ایجاد A Record برای دامین اصلی
  const createARecord = async (name: string, serverIP: string): Promise<boolean> => {
    return await createDNSRecord(name, 'A', serverIP, true);
  };

  // بررسی وجود DNS Record
  const checkDNSRecord = async (name: string): Promise<boolean> => {
    try {
      return await checkDNSRecordProxy(name);
    } catch (error) {
      console.error('Error checking DNS record:', error);
      return false;
    }
  };

  // تنظیم کامل DNS
  const setupCompleteDNS = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await setupCompleteDNSProxy();
      if (!result.success) {
        setError(result.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error setting up DNS:', error);
      setError(error instanceof Error ? error.message : 'خطا در تنظیم DNS');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSubdomain,
    createWildcardCNAME,
    createARecord,
    checkDNSRecord,
    setupCompleteDNS,
    getZoneId
  };
};
