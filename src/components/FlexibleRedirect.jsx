import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const redirectMap = {
  '/Git-Webinar': 'https://docs.google.com/forms/d/e/1FAIpQLScvtpRas6FJ39SLZFxdO7AgAol9kONQGpMkkWMsE1euuVdMwg/viewform?usp=header',
  '/Git-Evaluation': 'https://docs.google.com/forms/d/e/1FAIpQLSe4-DWFABHVVz_ZRWEeWYWX1HEHPiFt1KgLrWZf2X-QDS5YRA/viewform?usp=header',
  '/UIUX-Webinar': 'https://docs.google.com/forms/d/e/1FAIpQLSfP3_qOiL8P6JZwWlb9UBFzIJfeoi8F1flmZhfpxdF9K0PzGw/viewform?usp=header',
  '/UIUX-Evaluation': 'https://docs.google.com/forms/d/e/1FAIpQLSe1MUM9Z8V_zNnMt2O6J2fyn8ibSNisPM5QCIYmjyXbAQKdzQ/viewform?usp=header',
  '/CSIT-Night-Survey' : 'https://docs.google.com/forms/d/e/1FAIpQLSezsL4IxVt-tvOqh-YPB9Zp0SW905zF-t7LhekYmkZESZwfWQ/viewform?usp=header',
  '/AWS-Webinar' : 'https://docs.google.com/forms/d/e/1FAIpQLSehYxXvDOPlxepwBYukl60pcqyTcx76Jg7ZVyGZYuDC4u7HgA/viewform?usp=header',
  '/AWS-Evaluation' : 'https://docs.google.com/forms/d/e/1FAIpQLSe9XiC3vx84LHB6VNz0QAvVJFdKmxPvK-A2zTsryx-CTEsllA/viewform?usp=header',
  '/MerchDesignSubmission' : 'https://docs.google.com/forms/d/e/1FAIpQLSdt2EHOksm3TR7S1vJtADrQO74e52esoI35MG0CZ7Kursa6rQ/viewform?usp=header',
  '/CTC-Webinar' : 'https://docs.google.com/forms/d/e/1FAIpQLSeDeBqxc8mCbJKoHLLTNobQRdc6PLh0LujzWEOs6kpYTs7rFw/viewform?usp=header',
  '/CTC-Evaluation' : 'https://docs.google.com/forms/d/e/1FAIpQLSeTL8K_7Xrh0KcmFrdgr6eJ9bgOrUx6AK5VtSDcdrUUCV-F8w/viewform?usp=header',
  '/gamedev-files' : 'https://drive.google.com/uc?export=download&id=1qvVm9NUkD0i5bSR7Wob5wLLDqZ4DukDO',
  '/TB2026-Evaluation' : 'https://docs.google.com/forms/d/e/1FAIpQLSeFEVqtzDBGoC_d84HvP9ekNIptuwK773AO-2O8gUGDx_Gtaw/viewform?usp=header',
  // Add more here
};

function FlexibleRedirect() {
  const location = useLocation();
  const path = location.pathname;

  const redirectUrl = redirectMap[path];

  useEffect(() => {
    if (redirectUrl) {
      window.location.replace(redirectUrl);
    }
  }, [redirectUrl]);

  if (!redirectUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">
          ⚠️ No redirect found for <code>{path}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg">Redirecting...</p>
    </div>
  );
}

export default FlexibleRedirect;
