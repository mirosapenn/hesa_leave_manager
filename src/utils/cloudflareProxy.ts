// Cloudflare API Proxy برای حل مشکل CORS
// این فایل یک راه‌حل موقت برای حل مشکل CORS است

interface CloudflareConfig {
  apiKey: string;
  zoneId: string;
  domain: string;
}

const config: CloudflareConfig = {
  apiKey: '9222e96d38935c8777393f430748b0af06110',
  zoneId: 'd873f874ce4da55f7b7e2384441a9620',
  domain: 'finet.pro'
};

// تابع برای ایجاد DNS Record بدون CORS
export const createDNSRecordProxy = async (name: string, type: string, content: string, proxied: boolean = true): Promise<boolean> => {
  try {
    // استفاده از یک CORS proxy عمومی
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const apiUrl = encodeURIComponent(`https://api.cloudflare.com/client/v4/zones/${config.zoneId}/dns_records`);
    
    const response = await fetch(proxyUrl + apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        name,
        content,
        ttl: 1,
        proxied
      })
    });

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Error creating DNS record via proxy:', error);
    return false;
  }
};

// تابع برای بررسی DNS Record بدون CORS
export const checkDNSRecordProxy = async (name: string): Promise<boolean> => {
  try {
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const apiUrl = encodeURIComponent(`https://api.cloudflare.com/client/v4/zones/${config.zoneId}/dns_records?name=${name}`);
    
    const response = await fetch(proxyUrl + apiUrl, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data.success && data.result && data.result.length > 0;
  } catch (error) {
    console.error('Error checking DNS record via proxy:', error);
    return false;
  }
};

// تابع برای تنظیم کامل DNS
export const setupCompleteDNSProxy = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const serverIP = '51.75.62.168';
    const results: string[] = [];

    // 1. بررسی و ایجاد A Record برای دامین اصلی
    const aRecordExists = await checkDNSRecordProxy('finet.pro');
    if (!aRecordExists) {
      const aRecordSuccess = await createDNSRecordProxy('finet.pro', 'A', serverIP, true);
      results.push(aRecordSuccess ? 'A Record برای finet.pro ایجاد شد' : 'خطا در ایجاد A Record برای finet.pro');
    } else {
      results.push('A Record برای finet.pro از قبل موجود است');
    }

    // 2. بررسی و ایجاد A Record برای www
    const wwwRecordExists = await checkDNSRecordProxy('www.finet.pro');
    if (!wwwRecordExists) {
      const wwwRecordSuccess = await createDNSRecordProxy('www.finet.pro', 'A', serverIP, true);
      results.push(wwwRecordSuccess ? 'A Record برای www.finet.pro ایجاد شد' : 'خطا در ایجاد A Record برای www.finet.pro');
    } else {
      results.push('A Record برای www.finet.pro از قبل موجود است');
    }

    // 3. بررسی و ایجاد Wildcard CNAME
    const wildcardExists = await checkDNSRecordProxy('*.finet.pro');
    if (!wildcardExists) {
      const wildcardSuccess = await createDNSRecordProxy('*.finet.pro', 'CNAME', 'finet.pro', true);
      results.push(wildcardSuccess ? 'Wildcard CNAME برای *.finet.pro ایجاد شد' : 'خطا در ایجاد Wildcard CNAME برای *.finet.pro');
    } else {
      results.push('Wildcard CNAME برای *.finet.pro از قبل موجود است');
    }

    return {
      success: true,
      message: results.join('\n')
    };
  } catch (error) {
    console.error('Error setting up DNS via proxy:', error);
    return {
      success: false,
      message: `خطا در تنظیم DNS: ${error instanceof Error ? error.message : 'خطای نامشخص'}`
    };
  }
};
