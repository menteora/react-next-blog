"use client";
import { useEffect } from "react";
import { HSStaticMethods } from "preline";

const PrelineInit: React.FC = () => {
  useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);
  return null;
};

export default PrelineInit;
