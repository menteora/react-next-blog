"use client";

import Link from "next/link";
import { useCookieConsent } from "../contexts/CookieConsentContext";

const Footer: React.FC = () => {
  const { openBanner } = useCookieConsent();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-center p-6 border-t border-gray-200 dark:border-gray-700">
      <p>&copy; {new Date().getFullYear()} React Markdown Blog. All rights reserved.</p>
      <p className="text-sm mt-1">Powered by React, Tailwind CSS, and your Markdown!</p>
      <nav className="text-sm mt-1 space-x-1">
        <Link href="/page/privacy-policy" className="underline hover:text-primary-600 dark:hover:text-primary-400">
          Privacy Policy
        </Link>
        <span>|</span>
        <Link href="/page/cookie-policy" className="underline hover:text-primary-600 dark:hover:text-primary-400 ml-1">
          Cookie Policy
        </Link>
      </nav>
      <button
        onClick={openBanner}
        className="mt-2 underline text-sm hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
        aria-label="Gestisci preferenze cookie"
      >
        Gestisci preferenze cookie
      </button>
    </footer>
  );
};

export default Footer;
