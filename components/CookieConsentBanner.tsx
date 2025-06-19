"use client";

import React from 'react';
import Link from 'next/link';
import { useCookieConsent } from '../contexts/CookieConsentContext';

const CookieConsentBanner: React.FC = () => {
  const { showBanner, giveConsent, declineConsent } = useCookieConsent();

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white text-gray-800 p-4 shadow-md border-t border-gray-200 z-[100]"
      role="dialog"
      aria-live="polite"
      aria-label="Consenso cookie"
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm mb-3 sm:mb-0 sm:mr-4">
          Usiamo cookie tecnici indispensabili al funzionamento del sito e, solo se acconsenti, cookie di analytics per statistiche anonime.
          Per maggiori dettagli consulta la nostra{' '}
          <Link href="/page/cookie-policy" className="underline hover:text-primary-600">
            Cookie Policy
          </Link>.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={declineConsent}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Rifiuta cookie"
          >
            Rifiuta
          </button>
          <button
            onClick={giveConsent}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary-700 hover:bg-primary-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Accetta cookie"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
