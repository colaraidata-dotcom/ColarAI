export type ProfileType = 'child' | 'teen' | 'adult_self' | 'adult_unrestricted';
export type RuleAction = 'allow' | 'block' | 'limit';
export type CategoryId =
  | 'social_media'
  | 'adult_content'
  | 'gaming'
  | 'streaming'
  | 'news'
  | 'shopping'
  | 'gambling'
  | 'productivity'
  | 'education'
  | 'communication';
export type Platform = 'ios' | 'android' | 'macos' | 'windows' | 'browser' | 'router';
export type OverrideStatus = 'pending' | 'approved' | 'rejected';
export type SubscriptionTier = 'free' | 'basic' | 'family';
export type BlockEventAction = 'allowed' | 'blocked' | 'limit_reached';

export interface Profile {
  id: string;
  accountId: string;
  name: string;
  type: ProfileType;
  avatarColor: string;
  avatarEmoji: string;
  isActive: boolean;
  deviceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRule {
  id: string;
  profileId: string;
  category: CategoryId;
  action: RuleAction;
  dailyLimitMinutes?: number;
}

export interface SiteOverride {
  id: string;
  profileId: string;
  url: string;
  action: RuleAction;
  addedAt: string;
}

export interface Schedule {
  id: string;
  profileId: string;
  label: string;
  days: number[];
  startTime: string;
  endTime: string;
  action: RuleAction;
  categories: CategoryId[];
}

export interface Device {
  id: string;
  accountId: string;
  profileId: string;
  deviceName: string;
  platform: Platform;
  lastSeen: string;
  isOnline: boolean;
  osVersion?: string;
}

export interface AccessRequest {
  id: string;
  profileId: string;
  profileName: string;
  profileEmoji: string;
  url: string;
  siteName: string;
  category: CategoryId;
  status: OverrideStatus;
  requestedAt: string;
  expiresAt?: string;
  note?: string;
}

export interface UsageReport {
  profileId: string;
  period: 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
  totalMinutes: number;
  blockedCount: number;
  allowedCount: number;
  categoryBreakdown: CategoryUsage[];
  topSites: SiteUsage[];
  dailyTrend: DailyUsage[];
}

export interface CategoryUsage {
  category: CategoryId;
  minutes: number;
  percentage: number;
  blocked: number;
}

export interface SiteUsage {
  domain: string;
  minutes: number;
  visitCount: number;
  blocked: boolean;
}

export interface DailyUsage {
  date: string;
  minutes: number;
  blocked: number;
}

export interface BlockEvent {
  id: string;
  profileId: string;
  deviceId: string;
  url: string;
  category: CategoryId;
  action: BlockEventAction;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  type: 'access_request' | 'weekly_report' | 'device_added' | 'limit_reached' | 'tamper_attempt';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  accessRequestId?: string;
}

export interface Account {
  id: string;
  email: string;
  displayName: string;
  subscriptionTier: SubscriptionTier;
  profileCount: number;
  deviceCount: number;
  createdAt: string;
}

export interface ClassificationResult {
  url: string;
  domain: string;
  categories: CategoryId[];
  confidence: number;
  method: 'dns' | 'pattern' | 'ai';
}
