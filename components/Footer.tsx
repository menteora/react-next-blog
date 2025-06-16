"use client";

import Link from "next/link";
import { useCookieConsent } from "../contexts/CookieConsentContext";

const Footer: React.FC = () => {
  const { openBanner } = useCookieConsent();

  return (
    <footer className="bg-primary-800 text-primary-100 text-center p-6 shadow-inner">
      <p>&copy; {new Date().getFullYear()} React Markdown Blog. All rights reserved.</p>
      <p className="text-sm mt-1">
        Powered by React, Tailwind CSS, and your Markdown!{' '}
        <Link href="/page/privacy-policy" className="underline hover:text-primary-300">
          Informativa Privacy e Cookie Policy
        </Link>
      </p>
      <button
        onClick={openBanner}
        className="mt-2 underline text-sm hover:text-primary-300 focus:outline-none"
        aria-label="Gestisci preferenze cookie"
      >
        Gestisci preferenze cookie
      </button>
    </footer>
  );
};

export default Footer;
