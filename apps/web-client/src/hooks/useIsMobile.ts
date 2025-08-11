import { useMediaQuery } from "./useMediaQuery";

export function useIsMobile() {
  // Tailwind md: 768px
  const isDesktopOrUp = useMediaQuery("(min-width: 768px)");
  return !isDesktopOrUp;
} 