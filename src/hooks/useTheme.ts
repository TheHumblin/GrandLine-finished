import { useEffect } from 'react';
import type { ThemeName } from '@/types';

export const THEMES: { id: ThemeName; name: string; description: string; primaryColor: string }[] = [
  {
    id: 'strawhat',
    name: 'Straw Hat Pirates',
    description: 'Dark ocean with gold treasure accents',
    primaryColor: '#F5A623',
  },
  {
    id: 'marines',
    name: 'Marines',
    description: 'Deep navy with justice blue',
    primaryColor: '#4A9EFF',
  },
  {
    id: 'redhair',
    name: 'Red Hair Pirates',
    description: 'Dark crimson with burning orange',
    primaryColor: '#E84040',
  },
  {
    id: 'doflamingo',
    name: 'Donquixote Family',
    description: 'Dark purple with neon pink',
    primaryColor: '#E040A0',
  },
  {
    id: 'whitebeard',
    name: 'Whitebeard Pirates',
    description: 'Dark gray with gold diamond',
    primaryColor: '#F0A020',
  },
  {
    id: 'bigmom',
    name: 'Big Mom Pirates',
    description: 'Dark rose with candy pink',
    primaryColor: '#E06090',
  },
];

export function useTheme(theme: ThemeName = 'strawhat') {
  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    THEMES.forEach(t => root.classList.remove(`theme-${t.id}`));
    // Poneglyph is a separate, account-persisted overlay owned by ThemeController.
    // Page navigation must never clear it when applying a crew's base theme.
    if (theme !== 'strawhat') root.classList.add(`theme-${theme}`);
  }, [theme]);
}

