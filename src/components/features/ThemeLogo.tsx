import { getThemeLogo } from '@/lib/themeLogos';
import type { ThemeName } from '@/types';

interface ThemeLogoProps { theme?: ThemeName; poneglyphActive?: boolean; }

export default function ThemeLogo({ theme = 'strawhat', poneglyphActive = false }: ThemeLogoProps) {
  const logo = getThemeLogo(theme, poneglyphActive);
  return (
    <img
      src={logo.src}
      alt={logo.alt}
      width={40}
      height={40}
      draggable={false}
      className="h-10 w-10 shrink-0 object-contain transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
    />
  );
}
