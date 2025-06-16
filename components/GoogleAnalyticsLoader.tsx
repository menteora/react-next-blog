"use client";

import { useEffect } from 'react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { initGA } from '../utils/analytics';

const GoogleAnalyticsLoader: React.FC = () => {
  const { consentGiven } = useCookieConsent();
  const { config: siteConfig, isLoading } = useSiteConfig();

  useEffect(() => {
    if (consentGiven && !isLoading && siteConfig.gaMeasurementId) {
      if (!document.getElementById('ga-script')) {
        const script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaMeasurementId}`;
        document.head.appendChild(script);

        const init = document.createElement('script');
        init.id = 'ga-init';
        init.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());`;
        document.head.appendChild(init);
      }

      if (window.gtag) {
        initGA(siteConfig.gaMeasurementId);
      }
    }
  }, [consentGiven, isLoading, siteConfig.gaMeasurementId]);

  return null;
};

export default GoogleAnalyticsLoader;
