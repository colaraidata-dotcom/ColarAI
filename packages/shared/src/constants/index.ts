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

/**
 * Objective content theme flags emitted by the AI scorer (content_scores.themes).
 * These are descriptive signals, NOT value judgements — the value judgement lives
 * in the policy layer below (which themes/levels a given value profile blocks).
 */
export type ContentTheme =
  | 'bullying'
  | 'darkThemes'
  | 'war'
  | 'romance'
  | 'drugs'
  | 'alcohol';

/**
 * A value profile is a reusable POLICY preset over the objective signals.
 * Adding/tuning a community's values = editing a few rule lines here — never
 * retraining a model. `criteria` maps 1:1 onto the content_criteria table;
 * `categoryOverrides` forces decisions at the DNS/domain cascade layer so the
 * same value policy governs both deep content scoring and raw domain access.
 */
export interface ValueProfilePreset {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  criteria: {
    max_violence: number;
    max_language: number;
    max_sexual_content: number;
    max_fear_factor: number;
    max_substance_use: number;
    blocked_themes: ContentTheme[];
    min_fit_score: number;
  };
  categoryOverrides: Partial<Record<CategoryId, 'allow' | 'block'>>;
}

export const VALUE_PROFILE_PRESETS: ValueProfilePreset[] = [
  {
    id: 'faith_conservative',
    label: 'İnançlı / Muhafazakâr',
    labelEn: 'Faith-Conservative',
    description:
      'Çıplaklık ve müstehcenliğe sıfır tolerans, alkol/kumar görselleri engelli, romantik ve karanlık temalar sınırlı.',
    criteria: {
      max_violence: 3,
      max_language: 1,
      max_sexual_content: 0,
      max_fear_factor: 4,
      max_substance_use: 0,
      blocked_themes: ['alcohol', 'drugs', 'romance'],
      min_fit_score: 80,
    },
    categoryOverrides: { adult_content: 'block', gambling: 'block' },
  },
  {
    id: 'secular_moderate',
    label: 'Modern / Seküler',
    labelEn: 'Secular-Moderate',
    description:
      'Yalnızca açık +18 içerik ve ağır şiddet engellenir; alkol/romantik temalar serbest.',
    criteria: {
      max_violence: 6,
      max_language: 6,
      max_sexual_content: 3,
      max_fear_factor: 7,
      max_substance_use: 5,
      blocked_themes: [],
      min_fit_score: 40,
    },
    categoryOverrides: { adult_content: 'block', gambling: 'block' },
  },
  {
    id: 'young_child',
    label: 'Küçük Çocuk (5–9)',
    labelEn: 'Young Child',
    description:
      'En sıkı kademe: korku, şiddet, romantizm ve madde kullanımına yer yok; sadece yüksek uyumlu içerik.',
    criteria: {
      max_violence: 1,
      max_language: 0,
      max_sexual_content: 0,
      max_fear_factor: 1,
      max_substance_use: 0,
      blocked_themes: ['bullying', 'darkThemes', 'war', 'romance', 'drugs', 'alcohol'],
      min_fit_score: 90,
    },
    categoryOverrides: {
      adult_content: 'block',
      gambling: 'block',
      social_media: 'block',
    },
  },
];

export const VALUE_PROFILE_MAP = Object.fromEntries(
  VALUE_PROFILE_PRESETS.map((p) => [p.id, p])
) as Record<string, ValueProfilePreset>;

/**
 * Fail-safe default for content that has not been classified yet (long tail).
 * Deep content scoring is precomputed in the catalog; brand-new content has no
 * score row, so until the async classifier fills it in we decide by profile:
 * restrictive profiles block the unknown, permissive profiles allow it.
 * (Applies to the deep-content layer only — NOT raw domain access, where
 * blocking every uncategorized domain would break normal browsing.)
 */
export const FAIL_SAFE_BY_PROFILE: Record<ProfileType, 'allow' | 'block'> = {
  child: 'block',
  teen: 'block',
  adult_self: 'allow',
  adult_unrestricted: 'allow',
};

export function failSafeFitScore(profileType: ProfileType): number {
  return FAIL_SAFE_BY_PROFILE[profileType] === 'block' ? 0 : 100;
}
