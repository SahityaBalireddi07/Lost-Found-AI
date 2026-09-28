import { CampusItem, MatchResult } from '../types';

// Stop words to exclude during tokenization
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'with', 'by',
  'is', 'was', 'it', 'or', 'has', 'had', 'been', 'left', 'found', 'lost',
  'this', 'that', 'from', 'my', 'me', 'i', 'near', 'under', 'inside', 'around',
  'some', 'very', 'small', 'item', 'belonging'
]);

// Important domain keywords with boosted weight (brands, colors, materials, item descriptors)
const KEYWORD_WEIGHTS: Record<string, number> = {
  // Brands
  apple: 3.5,
  airpods: 4.0,
  macbook: 4.0,
  iphone: 4.0,
  hydro: 3.5,
  flask: 3.5,
  herschel: 3.5,
  subaru: 3.5,
  toyota: 3.0,
  honda: 3.0,
  yosemite: 3.0,
  warby: 3.5,
  parker: 3.5,
  patagonia: 3.5,
  calculator: 3.5,
  marcus: 4.0,
  vance: 4.0,
  elena: 4.0,
  // Descriptors
  navy: 2.5,
  teal: 2.5,
  blue: 2.0,
  black: 1.5,
  silver: 2.0,
  gold: 2.0,
  carabiner: 3.0,
  lanyard: 3.0,
  fob: 3.0,
  stickers: 2.5,
  sticker: 2.5,
  dorm: 2.5,
  sleeve: 2.0,
  case: 2.0,
  badge: 2.5,
  card: 2.0,
  keys: 2.5,
  keychain: 2.5,
  tortoise: 3.0,
  glasses: 2.5,
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function getWordWeight(word: string): number {
  return KEYWORD_WEIGHTS[word] || 1.0;
}

/**
 * Calculates similarity between two campus items.
 */
export function calculateItemMatch(source: CampusItem, candidate: CampusItem): MatchResult | null {
  // Only match opposite types (Lost matches Found, and vice versa)
  if (source.type === candidate.type) {
    return null;
  }

  // Active status check
  if (source.status === 'reunited' || candidate.status === 'reunited') {
    return null;
  }

  let totalScore = 0;
  const matchingAttributes: string[] = [];
  const explanationPoints: string[] = [];

  // 1. Category Matching (Max 28 points)
  if (source.category === candidate.category) {
    totalScore += 28;
    matchingAttributes.push('Identical Category');
    explanationPoints.push(`Both items are classified under the same category (${source.category.replace('_', ' ')})`);
  } else {
    // Partial cross-category logic (e.g. ID cards and Keys often on same lanyard or bag)
    const relatedPairs = [
      ['id_cards', 'keys'],
      ['bags', 'clothing'],
      ['electronics', 'accessories'],
    ];
    const isRelated = relatedPairs.some(
      ([c1, c2]) =>
        (source.category === c1 && candidate.category === c2) ||
        (source.category === c2 && candidate.category === c1)
    );
    if (isRelated) {
      totalScore += 10;
      matchingAttributes.push('Related Category');
    }
  }

  // 2. Title Overlap & Weighted Token Match (Max 32 points)
  const sourceTitleTokens = tokenize(source.title);
  const candidateTitleTokens = tokenize(candidate.title);
  const commonTitleTokens: string[] = [];

  let titleIntersectionWeight = 0;
  let titleUnionWeight = 0;

  const allTitleTokens = Array.from(new Set([...sourceTitleTokens, ...candidateTitleTokens]));
  for (const token of allTitleTokens) {
    const inSource = sourceTitleTokens.includes(token);
    const inCandidate = candidateTitleTokens.includes(token);
    const weight = getWordWeight(token);

    if (inSource && inCandidate) {
      titleIntersectionWeight += weight;
      commonTitleTokens.push(token);
    }
    if (inSource || inCandidate) {
      titleUnionWeight += weight;
    }
  }

  const titleSimilarity = titleUnionWeight > 0 ? titleIntersectionWeight / titleUnionWeight : 0;
  const titlePoints = Math.min(32, Math.round(titleSimilarity * 45));
  totalScore += titlePoints;

  if (commonTitleTokens.length > 0) {
    matchingAttributes.push(`Title keywords: ${commonTitleTokens.slice(0, 3).join(', ')}`);
  }

  // 3. Description & Distinctive Features Semantic Overlap (Max 25 points)
  const sourceDescText = `${source.description} ${source.distinctiveFeatures || ''}`;
  const candidateDescText = `${candidate.description} ${candidate.distinctiveFeatures || ''}`;

  const sourceDescTokens = Array.from(new Set(tokenize(sourceDescText)));
  const candidateDescTokens = Array.from(new Set(tokenize(candidateDescText)));

  const sharedKeywords: string[] = [];
  let descMatchWeight = 0;

  for (const token of sourceDescTokens) {
    if (candidateDescTokens.includes(token)) {
      const weight = getWordWeight(token);
      descMatchWeight += weight;
      sharedKeywords.push(token);
    }
  }

  const descScore = Math.min(25, Math.round(descMatchWeight * 3));
  totalScore += descScore;

  if (sharedKeywords.length >= 2) {
    explanationPoints.push(
      `Shared descriptive traits: "${sharedKeywords.slice(0, 4).join('", "')}"`
    );
  }

  // 4. Campus Location Match (Max 10 points)
  const normLoc1 = source.location.toLowerCase();
  const normLoc2 = candidate.location.toLowerCase();

  if (normLoc1 === normLoc2) {
    totalScore += 10;
    matchingAttributes.push('Identical Location');
    explanationPoints.push(`Both reported at the same campus spot: ${source.location}`);
  } else {
    // Check if within the same main building
    const building1 = normLoc1.split('-')[0].trim();
    const building2 = normLoc2.split('-')[0].trim();
    if (building1.length > 3 && building1 === building2) {
      totalScore += 7;
      matchingAttributes.push('Same Building Zone');
      explanationPoints.push(`Reported in the same campus facility (${source.location.split('-')[0].trim()})`);
    }
  }

  // 5. Date Consistency & Proximity (Max 5 points)
  const d1 = new Date(source.date).getTime();
  const d2 = new Date(candidate.date).getTime();
  const dayDiff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);

  if (dayDiff <= 1) {
    totalScore += 5;
    matchingAttributes.push('Matching Timeline');
    explanationPoints.push('Occurred within 24 hours of each other');
  } else if (dayDiff <= 3) {
    totalScore += 3;
    matchingAttributes.push('Close Timeline (2-3 days)');
  }

  // Cap score at 98% (never claim 100% since human verification is strictly required)
  const finalScore = Math.min(97, Math.max(12, totalScore));

  // Minimum threshold to qualify as a suggested match
  if (finalScore < 45) {
    return null;
  }

  let confidence: 'High' | 'Moderate' | 'Possible' = 'Possible';
  if (finalScore >= 75) {
    confidence = 'High';
  } else if (finalScore >= 55) {
    confidence = 'Moderate';
  }

  // Format concise natural language explanation
  let explanation = '';
  if (explanationPoints.length > 0) {
    explanation = explanationPoints.join(' · ');
  } else {
    explanation = `Shared traits identified between "${source.title}" and "${candidate.title}".`;
  }

  return {
    sourceItem: source,
    matchedItem: candidate,
    score: finalScore,
    confidence,
    explanation,
    matchingAttributes,
  };
}

/**
 * Finds all potential matches for a given item against a collection of items.
 */
export function findMatchesForItem(targetItem: CampusItem, allItems: CampusItem[]): MatchResult[] {
  const matches: MatchResult[] = [];

  for (const item of allItems) {
    if (item.id === targetItem.id) continue;
    const match = calculateItemMatch(targetItem, item);
    if (match) {
      matches.push(match);
    }
  }

  // Sort highest score first
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Scans the entire campus database to surface top matched lost-and-found pairs.
 */
export function findAllCampusMatches(allItems: CampusItem[]): MatchResult[] {
  const lostItems = allItems.filter((it) => it.type === 'lost' && it.status === 'active');
  const foundItems = allItems.filter((it) => it.type === 'found' && it.status === 'active');
  const results: MatchResult[] = [];
  const seenPairs = new Set<string>();

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const pairKey = [lost.id, found.id].sort().join('::');
      if (seenPairs.has(pairKey)) continue;

      const match = calculateItemMatch(lost, found);
      if (match && match.score >= 50) {
        seenPairs.add(pairKey);
        results.push(match);
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
