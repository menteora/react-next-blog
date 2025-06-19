"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { initGA } from '../utils/analytics';
import { useSiteConfig } from './SiteConfigContext';

interface CookieConsentContextType {
  consentGiven: boolean | null; // null: undecided, true: given, false: declined
  showBanner: boolean;
  giveConsent: () => void;
  declineConsent: () => void;
  openBanner: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

// Utility helpers to read and write the consent cookie
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string, days = 180) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

// Remove a cookie by setting its expiry in the past
const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
};

// Clear common Google Analytics cookies
const clearGaCookies = () => {
  if (typeof document === 'undefined') return;
  document.cookie.split(';').forEach(cookieString => {
    const [cookieName] = cookieString.trim().split('=');
    if (cookieName === '_gid' || cookieName === '_gat' || cookieName.startsWith('_ga')) {
      deleteCookie(cookieName);
    }
  });
};

// Helper function to safely call gtag for consent updates
const safeGtagConsentUpdate = (consentArgs: Record<string, 'granted' | 'denied'>) => {
  if (window.gtag) {
    window.gtag('consent', 'update', consentArgs);
    console.log('gtag consent updated:', consentArgs);
  } else {
    // This case is less likely if gtag.js is loaded, but good to be aware.
    // The default consent state set in index.html will hold until gtag is available.
    console.warn('gtag not available for consent update. Default consent settings apply.');
  }
};

export const CookieConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const { config: siteConfig, isLoading: isSiteConfigLoading } = useSiteConfig();

  const initializeConsent = useCallback(() => {
    const storedConsent = getCookie('cookieConsent');
    const gaId = siteConfig.gaMeasurementId;

    if (storedConsent === 'true') {
      safeGtagConsentUpdate({ 'analytics_storage': 'granted' });
      setConsentGiven(true);
      setShowBanner(false);
      if (gaId && !isSiteConfigLoading && window.gtag) {
        initGA(gaId); // initGA calls gtag('config', ...) which depends on consent
      }
    } else if (storedConsent === 'false') {
      safeGtagConsentUpdate({ 'analytics_storage': 'denied' });
      setConsentGiven(false);
      setShowBanner(false);
      clearGaCookies();
    } else {
      // Undecided: Default consent 'denied' for analytics_storage (set in index.html) applies.
      setConsentGiven(null);
      setShowBanner(true);
    }
  }, [siteConfig.gaMeasurementId, isSiteConfigLoading]);

  useEffect(() => {
    // Initialize only when site config is loaded to ensure gaId is available
    if (!isSiteConfigLoading) {
        initializeConsent();
    }
  }, [isSiteConfigLoading, initializeConsent]);

  const giveConsent = () => {
    const gaId = siteConfig.gaMeasurementId;
    safeGtagConsentUpdate({ 'analytics_storage': 'granted' });
    setConsentGiven(true);
    setShowBanner(false);
    setCookie('cookieConsent', 'true');
    if (gaId && !isSiteConfigLoading && window.gtag) {
      initGA(gaId);
    }
  };

  const declineConsent = () => {
    safeGtagConsentUpdate({ 'analytics_storage': 'denied' });
    setConsentGiven(false);
    setShowBanner(false);
    setCookie('cookieConsent', 'false');
    document.getElementById('ga-script')?.remove();
    document.getElementById('ga-init')?.remove();
    clearGaCookies();
  };

  const openBanner = () => {
    setShowBanner(true);
  };

  return (
    <CookieConsentContext.Provider value={{ consentGiven, showBanner, giveConsent, declineConsent, openBanner }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
