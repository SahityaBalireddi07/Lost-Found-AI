export type ItemType = 'lost' | 'found';

export type ItemStatus = 'active' | 'reunited' | 'claimed';

export type ItemCategory =
  | 'electronics'
  | 'id_cards'
  | 'keys'
  | 'bags'
  | 'bottles'
  | 'clothing'
  | 'books'
  | 'accessories'
  | 'other';

export interface CampusItem {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: ItemStatus;
  createdAt: number;
  distinctiveFeatures?: string;
}

export interface MatchResult {
  sourceItem: CampusItem;
  matchedItem: CampusItem;
  score: number; // 0 - 100
  confidence: 'High' | 'Moderate' | 'Possible';
  explanation: string;
  matchingAttributes: string[];
}

export interface ClaimSubmission {
  id: string;
  itemId: string;
  itemTitle: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  proofDetails: string;
  pickupPreference: string;
  message: string;
  submittedAt: number;
}
