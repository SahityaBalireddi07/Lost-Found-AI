import { CampusItem, ClaimSubmission } from '../types';
import { INITIAL_SAMPLE_ITEMS } from '../data/sampleItems';

const STORAGE_KEY_ITEMS = 'lost_and_found_ai_items_v1';
const STORAGE_KEY_CLAIMS = 'lost_and_found_ai_claims_v1';

export function getStoredItems(): CampusItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_SAMPLE_ITEMS));
      return INITIAL_SAMPLE_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAMPLE_ITEMS;
  } catch (err) {
    console.warn('Failed to load items from localStorage, using initial sample data', err);
    return INITIAL_SAMPLE_ITEMS;
  }
}

export function saveStoredItems(items: CampusItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to localStorage', err);
  }
}

export function addStoredItem(item: CampusItem): CampusItem[] {
  const existing = getStoredItems();
  const updated = [item, ...existing];
  saveStoredItems(updated);
  return updated;
}

export function updateStoredItemStatus(itemId: string, status: CampusItem['status']): CampusItem[] {
  const existing = getStoredItems();
  const updated = existing.map((it) => (it.id === itemId ? { ...it, status } : it));
  saveStoredItems(updated);
  return updated;
}

export function resetToSampleItems(): CampusItem[] {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_SAMPLE_ITEMS));
  } catch (err) {
    console.error('Error resetting sample items', err);
  }
  return INITIAL_SAMPLE_ITEMS;
}

export function getStoredClaims(): ClaimSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLAIMS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to load claims', err);
    return [];
  }
}

export function saveClaim(claim: ClaimSubmission): void {
  try {
    const current = getStoredClaims();
    localStorage.setItem(STORAGE_KEY_CLAIMS, JSON.stringify([claim, ...current]));
  } catch (err) {
    console.error('Failed to store claim', err);
  }
}
