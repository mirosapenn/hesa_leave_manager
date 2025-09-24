import { useState } from 'react';

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
      const zoneId = await getZoneId();
      if (!zoneId) {
        throw new Error('Zone ID not found');
      }

      const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          name,
          content,
          ttl: 1, // Auto TTL
          proxied
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return true;
      } else {
        throw new Error(data.errors?.[0]?.message || 'خطا در ایجاد DNS Record');
      }
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
      const zoneId = await getZoneId();
      if (!zoneId) return false;

      const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=${name}`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data.success && data.result.length > 0;
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
      const serverIP = '51.75.62.168';
      let allSuccess = true;

      // 1. ایجاد A Record برای دامین اصلی
      const aRecordExists = await checkDNSRecord('finet.pro');
      if (!aRecordExists) {
        const aRecordSuccess = await createARecord('finet.pro', serverIP);
        if (!aRecordSuccess) allSuccess = false;
      }

      // 2. ایجاد A Record برای www
      const wwwRecordExists = await checkDNSRecord('www.finet.pro');
      if (!wwwRecordExists) {
        const wwwRecordSuccess = await createARecord('www.finet.pro', serverIP);
        if (!wwwRecordSuccess) allSuccess = false;
      }

      // 3. ایجاد Wildcard CNAME
      const wildcardExists = await checkDNSRecord('*.finet.pro');
      if (!wildcardExists) {
        const wildcardSuccess = await createWildcardCNAME();
        if (!wildcardSuccess) allSuccess = false;
      }

      return allSuccess;
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
