"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { sendPageView } from '../utils/analytics';

const AnalyticsRouteChangeTracker: React.FC = () => {
  const pathname = usePathname();
  const { consentGiven } = useCookieConsent();
  const { config: siteConfig, isLoading: isSiteConfigLoading } = useSiteConfig();

  useEffect(() => {
    // Send page view if consent is given, GA is configured, and site config is loaded
    if (consentGiven && !isSiteConfigLoading && siteConfig.gaMeasurementId && window.gtag) {
      // location.pathname for HashRouter gives the path after #, e.g., "/post/my-slug"
      sendPageView(location.pathname, siteConfig.gaMeasurementId);
    }
  }, [pathname, consentGiven, siteConfig.gaMeasurementId, isSiteConfigLoading]);

  return null; // This component does not render anything
};

export default AnalyticsRouteChangeTracker;
