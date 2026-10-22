import strawhat from '@/assets/theme-strawhat-logo.png';
import marines from '@/assets/theme-marines-logo.png';
import redhair from '@/assets/theme-redhair-logo.png';
import doflamingo from '@/assets/theme-doflamingo-logo.webp';
import whitebeard from '@/assets/theme-whitebeard-logo.png';
import bigmom from '@/assets/theme-bigmom-logo.webp';
import poneglyph from '@/assets/theme-poneglyph-logo.png';
import type { ThemeName } from '@/types';

export interface ThemeLogoAsset { src: string; alt: string; }
export const THEME_LOGOS: Record<ThemeName, ThemeLogoAsset> = {
  strawhat: { src: strawhat, alt: 'Straw Hat Pirates emblem' },
  marines: { src: marines, alt: 'Marines emblem' },
  redhair: { src: redhair, alt: 'Red Hair Pirates emblem' },
  doflamingo: { src: doflamingo, alt: 'Donquixote Family emblem' },
  whitebeard: { src: whitebeard, alt: 'Whitebeard Pirates emblem' },
  bigmom: { src: bigmom, alt: 'Big Mom Pirates emblem' },
};
const PONEGLYPH_LOGO: ThemeLogoAsset = { src: poneglyph, alt: 'Legendary Poneglyph skin emblem' };

// The active Legendary overlay takes precedence over the underlying crew theme.
export function getThemeLogo(theme: ThemeName = 'strawhat', poneglyphActive = false): ThemeLogoAsset {
  if (poneglyphActive) return PONEGLYPH_LOGO;
  return THEME_LOGOS[theme] ?? THEME_LOGOS.strawhat;
}
