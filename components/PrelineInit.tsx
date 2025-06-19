"use client";
import { useEffect } from "react";
// Import compiled JS build to avoid TypeScript entry resolution issues
import { HSStaticMethods } from "preline/dist/index.js";

const PrelineInit: React.FC = () => {
  useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);
  return null;
};

export default PrelineInit;
