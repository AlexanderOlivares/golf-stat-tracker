import { useState, useEffect } from "react";

export default function useMediaQuery(maxWidth: number) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, maxWidth]);

  return matches;
}
