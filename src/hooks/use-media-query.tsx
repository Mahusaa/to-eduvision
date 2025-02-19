import { useState, useEffect } from 'react';

/**
 * Custom hook to handle media queries
 * @param query The media query string to evaluate
 * @returns Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  // Initialize with null to prevent hydration mismatch
  const [matches, setMatches] = useState<boolean>(false);
  // Track if component is mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener function
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]); // Only re-run if query changes

  // Return false during SSR to prevent hydration mismatch
  if (!mounted) return false;

  return matches;
};

// Common breakpoint exports for convenience
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;
