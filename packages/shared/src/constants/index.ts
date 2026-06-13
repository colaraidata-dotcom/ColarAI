import type { CategoryId, ProfileType } from '../types';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  labelEn: string;
  description: string;
  icon: string;
  color: string;
  defaultAction: Record<ProfileType, 'allow' | 'block'>;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'social_media',
    label: 'Social Media',
    labelEn: 'Social Media',
    description: 'Instagram, TikTok, X, Snapchat',
    icon: 'share-2',
    color: '#EC4899',
    defaultAction: { child: 'block', teen: 'allow', adult_self: 'block', adult_unrestricted: 'allow' },
  },
  {
    id: 'adult_content',
    label: 'Adult Content',
    labelEn: 'Adult Content',
    description: 'Pornography and explicit content',
    icon: 'eye-off',
    color: '#EF4444',
    defaultAction: { child: 'block', teen: 'block', adult_self: 'allow', adult_unrestricted: 'allow' },
  },
  {
    id: 'gaming',
    label: 'Gaming',
    labelEn: 'Gaming',
    description: 'Steam, Roblox, online games',
    icon: 'gamepad-2',
    color: '#8B5CF6',
    defaultAction: { child: 'allow', teen: 'allow', adult_self: 'block', adult_unrestricted: 'allow' },
  },
  {
    id: 'streaming',
    label: 'Streaming & Video',
    labelEn: 'Streaming & Video',
    description: 'YouTube, Netflix, Twitch',
    icon: 'play-circle',
    color: '#F59E0B',
    defaultAction: { child: 'allow', teen: 'allow', adult_self: 'allow', adult_unrestricted: 'allow' },
  },
  {
    id: 'news',
    label: 'News & Media',
    labelEn: 'News & Media',
    description: 'News sites, blogs and opinion columns',
    icon: 'newspaper',
    color: '#6B7280',
    defaultAction: { child: 'block', teen: 'allow', adult_self: 'block', adult_unrestricted: 'allow' },
  },
  {
    id: 'shopping',
    label: 'Shopping',
    labelEn: 'Shopping',
    description: 'Amazon, eBay, retail sites',
    icon: 'shopping-cart',
    color: '#10B981',
    defaultAction: { child: 'block', teen: 'allow', adult_self: 'block', adult_unrestricted: 'allow' },
  },
  {
    id: 'gambling',
    label: 'Gambling',
    labelEn: 'Gambling',
    description: 'Online casinos, sports betting',
    icon: 'dice-6',
    color: '#DC2626',
    defaultAction: { child: 'block', teen: 'block', adult_self: 'block', adult_unrestricted: 'allow' },
  },
  {
    id: 'productivity',
    label: 'Productivity & Work',
    labelEn: 'Productivity & Work',
    description: 'Google Docs, GitHub, Notion',
    icon: 'briefcase',
    color: '#0EA5E9',
    defaultAction: { child: 'allow', teen: 'allow', adult_self: 'allow', adult_unrestricted: 'allow' },
  },
  {
    id: 'education',
    label: 'Education',
    labelEn: 'Education',
    description: 'Khan Academy, Coursera, Wikipedia',
    icon: 'book-open',
    color: '#3B82F6',
    defaultAction: { child: 'allow', teen: 'allow', adult_self: 'allow', adult_unrestricted: 'allow' },
  },
  {
    id: 'communication',
    label: 'Communication',
    labelEn: 'Communication',
    description: 'Email, messaging apps',
    icon: 'message-circle',
    color: '#22D3EE',
    defaultAction: { child: 'allow', teen: 'allow', adult_self: 'allow', adult_unrestricted: 'allow' },
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, CategoryMeta>;

export const PROFILE_TYPE_META: Record<ProfileType, { label: string; emoji: string; description: string; color: string }> = {
  child: {
    label: 'Child',
    emoji: '🧒',
    description: 'Ages 5–12. Strict allowlist, no social media, safe search enforced.',
    color: '#3B82F6',
  },
  teen: {
    label: 'Teen',
    emoji: '🧑',
    description: 'Ages 13–17. Moderate access, social media with time limits, adult content blocked.',
    color: '#8B5CF6',
  },
  adult_self: {
    label: 'Adult (Self-Control)',
    emoji: '🧑‍💼',
    description: 'Blocks social media and news during work hours. Personal focus mode.',
    color: '#22C55E',
  },
  adult_unrestricted: {
    label: 'Adult (Unrestricted)',
    emoji: '👤',
    description: 'Full access. Can approve override requests.',
    color: '#0EA5E9',
  },
};

export const PROFILE_COLORS = [
  '#0EA5E9', '#8B5CF6', '#EC4899', '#22C55E',
  '#F59E0B', '#3B82F6', '#EF4444', '#22D3EE',
];

export const SUBSCRIPTION_TIERS = {
  free: { label: 'Free', profileLimit: 1, deviceLimit: 2, price: 0 },
  basic: { label: 'Basic', profileLimit: 3, deviceLimit: 5, price: 999 },
  family: { label: 'Family', profileLimit: 10, deviceLimit: 20, price: 1499 },
};
