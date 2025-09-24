import React, { useState } from 'react';
import { useCloudflare } from '../hooks/useCloudflare';
import { RefreshCw, CheckCircle, XCircle, Globe, Zap } from 'lucide-react';

const CloudflareManager: React.FC = () => {
  const { 
    createWildcardCNAME, 
    createARecord,
    checkDNSRecord, 
    setupCompleteDNS,
    loading, 
    error 
  } = useCloudflare();
  
  const [wildcardStatus, setWildcardStatus] = useState<'unknown' | 'exists' | 'missing'>('unknown');
  const [aRecordStatus, setARecordStatus] = useState<'unknown' | 'exists' | 'missing'>('unknown');
  const [wwwRecordStatus, setWwwRecordStatus] = useState<'unknown' | 'exists' | 'missing'>('unknown');
  const [setupComplete, setSetupComplete] = useState(false);

  const checkAllDNSStatus = async () => {
    const wildcardExists = await checkDNSRecord('*.finet.pro');
    const aRecordExists = await checkDNSRecord('finet.pro');
    const wwwRecordExists = await checkDNSRecord('www.finet.pro');
    
    setWildcardStatus(wildcardExists ? 'exists' : 'missing');
    setARecordStatus(aRecordExists ? 'exists' : 'missing');
    setWwwRecordStatus(wwwRecordExists ? 'exists' : 'missing');
  };

  const setupWildcard = async () => {
    const success = await createWildcardCNAME();
    if (success) {
      setWildcardStatus('exists');
    }
  };

  const setupARecord = async () => {
    const success = await createARecord('finet.pro', '51.75.62.168');
    if (success) {
      setARecordStatus('exists');
    }
  };

  const setupWwwRecord = async () => {
    const success = await createARecord('www.finet.pro', '51.75.62.168');
    if (success) {
      setWwwRecordStatus('exists');
    }
  };

  const handleCompleteSetup = async () => {
    const success = await setupCompleteDNS();
    if (success) {
      setSetupComplete(true);
      await checkAllDNSStatus();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5" />
        مدیریت Cloudflare DNS
      </h3>
      
      <div className="space-y-4">
        {/* دکمه تنظیم کامل */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">تنظیم کامل DNS</h4>
              <p className="text-sm text-blue-700">تنظیم خودکار تمام رکوردهای DNS مورد نیاز</p>
            </div>
            <button
              onClick={handleCompleteSetup}
              disabled={loading || setupComplete}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {setupComplete ? 'تنظیم شده' : 'تنظیم کامل'}
            </button>
          </div>
        </div>

        {/* وضعیت DNS Records */}
        <div className="space-y-3">
          {/* A Record */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">A Record (finet.pro)</h4>
              <p className="text-sm text-gray-600">دامین اصلی</p>
            </div>
            <div className="flex items-center gap-2">
              {aRecordStatus === 'exists' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {aRecordStatus === 'missing' && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              {aRecordStatus === 'missing' && (
                <button
                  onClick={setupARecord}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  ایجاد
                </button>
              )}
            </div>
          </div>

          {/* WWW Record */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">A Record (www.finet.pro)</h4>
              <p className="text-sm text-gray-600">دامین با www</p>
            </div>
            <div className="flex items-center gap-2">
              {wwwRecordStatus === 'exists' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {wwwRecordStatus === 'missing' && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              {wwwRecordStatus === 'missing' && (
                <button
                  onClick={setupWwwRecord}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  ایجاد
                </button>
              )}
            </div>
          </div>

          {/* Wildcard CNAME */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Wildcard CNAME (*.finet.pro)</h4>
              <p className="text-sm text-gray-600">برای ساب‌دامین‌ها</p>
            </div>
            <div className="flex items-center gap-2">
              {wildcardStatus === 'exists' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {wildcardStatus === 'missing' && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              {wildcardStatus === 'missing' && (
                <button
                  onClick={setupWildcard}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  ایجاد
                </button>
              )}
            </div>
          </div>
        </div>

        {/* دکمه بررسی وضعیت */}
        <button
          onClick={checkAllDNSStatus}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          بررسی وضعیت DNS
        </button>

        {/* نمایش خطا */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* راهنمای تنظیمات */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h5 className="font-medium text-blue-900 mb-2">راهنمای تنظیمات:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• A Record برای دامین اصلی (finet.pro)</li>
            <li>• A Record برای www (www.finet.pro)</li>
            <li>• Wildcard CNAME برای ساب‌دامین‌ها (*.finet.pro)</li>
            <li>• تمام رکوردها به IP سرور (51.75.62.168) اشاره می‌کنند</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CloudflareManager;
