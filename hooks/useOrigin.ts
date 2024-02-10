import { useState, useEffect } from "react";

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);

  // Get origin
  const origin = typeof window !== undefined && window.location.origin ?
    window.location.origin : "";
  
  // Mount hook only in client component
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "";

  return origin;
};