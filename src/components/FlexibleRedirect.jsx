import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const redirectMap = {
  '/ccsea-month': 'https://docs.google.com/forms/d/e/1FAIpQLSeLeA-bG-kEpSoCKRDQ4dIjh7OskCkeBJ-DP4-m31ZCG1te8A/viewform?usp=preview',
  '/FunDataAn-Webinar': 'https://docs.google.com/forms/d/e/1FAIpQLSehts3J1HqsK88IvBUoa5RaE4Mc299JWuu2hd__Cvn8Jl2qeA/viewform?usp=header',
  '/FunDataAn-Evaluation': 'https://docs.google.com/forms/d/e/1FAIpQLSdQuCK9V90YYWC3lt4_7PSwBf_MMohQbv7F-AYO2ZC-ejzY8Q/viewform?usp=header',
  '/Cybersecurity-Webinar': 'https://docs.google.com/forms/d/e/1FAIpQLScBQ13y73-SYUfkMW1LrVE3-Z_ZLAUf4UhDsVvmoTLr9NbWtg/viewform?usp=header',
  '/Cybersecurity-Evaluation': 'https://docs.google.com/forms/d/e/1FAIpQLSdaq5befV0wx5vHXHmIfC3KMptEl_0zFUMuzE-JOTqNxqgtxQ/viewform?usp=header',
  '/AdvIAS-Webinar' : 'https://docs.google.com/forms/d/e/1FAIpQLSeRaWTlh80wcEJ78-_vfKxS9aDmrKoUsSvjc55YLkcXE4L7XQ/viewform?usp=header',
  '/AdvIAS-Evaluation' : 'https://docs.google.com/forms/d/e/1FAIpQLSdE0-l_vjEFFUmu255C6XAmC0aZt5IM0Dx2EU1BoWdAWmlCfw/viewform?usp=preview',
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
