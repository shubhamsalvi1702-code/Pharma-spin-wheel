export interface PrizeConfig {
  id: string;
  name: string;
  shortLabel: string;
  probability: number; // e.g. 10 for 10%
  color: string;
  textColor: string;
  accentColor: string;
  icon: 'kettle' | 'umbrella' | 'scissors' | 'gift' | 'package' | 'sparkles' | 'frown';
  isWin: boolean;
  congratsHeader: string;
  instruction: string;
}

export interface Participant {
  id: string;
  name: string;
  phone: string;
  pharmacyName: string;
  city: string;
  prizeId: string;
  prizeName: string;
  prizeSliceIndex: number;
  isWin: boolean;
  timestamp: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  claimCode: string;
}

export interface CampaignConfig {
  campaignTitle: string;
  campaignSubtitle: string;
  supportingLine: string;
  ctaText: string;
  spinInstruction: string;
  prizes: PrizeConfig[];
  adminPasswordHash?: string;
}

export interface RegistrationFormData {
  name: string;
  phone: string;
  pharmacyName: string;
  city: string;
  consentAccepted: boolean;
}

export interface SpinResponse {
  success: boolean;
  sliceIndex: number;
  prize: PrizeConfig;
  participant: Participant;
  message?: string;
  alreadyParticipated?: boolean;
}

export interface AdminStats {
  totalParticipants: number;
  totalPrizesIssued: number;
  prizeCounts: Record<string, number>;
  cityCounts: Record<string, number>;
  latestParticipants: Participant[];
}
