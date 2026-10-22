import { getShopState } from '@/data/shop';

export function getOwnedSkins(userId: string, savedSkins: string[] = []): string[] {
  const shop: { ownedSkins?: string[] } = getShopState(userId) || {};
  let gacha: { unlockedSkins?: string[] } = {};
  try { gacha = JSON.parse(localStorage.getItem(`grandline_gacha_${userId}`) || '{}') || {}; }
  catch { /* Invalid legacy collection does not grant any skins. */ }
  return Array.from(new Set([...savedSkins, ...(Array.isArray(shop.ownedSkins) ? shop.ownedSkins : []), ...(Array.isArray(gacha.unlockedSkins) ? gacha.unlockedSkins : [])])).filter(skin => typeof skin === 'string');
}
