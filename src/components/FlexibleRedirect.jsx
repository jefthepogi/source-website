import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const redirectMap = {
  '/ccsea-month': 'https://docs.google.com/forms/d/e/1FAIpQLSeLeA-bG-kEpSoCKRDQ4dIjh7OskCkeBJ-DP4-m31ZCG1te8A/viewform?usp=preview',
  '/Git-Webinar': 'https://docs.google.com/forms/d/e/1FAIpQLScvtpRas6FJ39SLZFxdO7AgAol9kONQGpMkkWMsE1euuVdMwg/viewform?usp=header',
  '/Git-Evaluation': 'https://docs.google.com/forms/d/e/1FAIpQLSe4-DWFABHVVz_ZRWEeWYWX1HEHPiFt1KgLrWZf2X-QDS5YRA/viewform?usp=header',
  '/UIUX-Webinar': 'https://docs.google.com/forms/d/e/1FAIpQLSfP3_qOiL8P6JZwWlb9UBFzIJfeoi8F1flmZhfpxdF9K0PzGw/viewform?usp=header',
  '/UIUX-Evaluation': 'https://docs.google.com/forms/d/e/1FAIpQLSe1MUM9Z8V_zNnMt2O6J2fyn8ibSNisPM5QCIYmjyXbAQKdzQ/viewform?usp=header',
  '/gamedev-files' : 'https://drive.google.com/uc?export=download&id=1qvVm9NUkD0i5bSR7Wob5wLLDqZ4DukDO',
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
