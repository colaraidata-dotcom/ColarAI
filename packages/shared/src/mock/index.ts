import type {
  Profile, CategoryRule, Device, AccessRequest,
  UsageReport, AppNotification, Account, SiteOverride,
  Schedule, BlockEvent,
} from '../types';

export const mockAccount: Account = {
  id: 'acc_001',
  email: 'john.doe@example.com',
  displayName: 'John Doe',
  subscriptionTier: 'family',
  profileCount: 4,
  deviceCount: 6,
  createdAt: '2026-01-15T10:00:00Z',
};

export const mockProfiles: Profile[] = [
  {
    id: 'prof_001',
    accountId: 'acc_001',
    name: 'Emma',
    type: 'child',
    avatarColor: '#3B82F6',
    avatarEmoji: '🧒',
    isActive: true,
    deviceCount: 2,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-05-20T08:00:00Z',
  },
  {
    id: 'prof_002',
    accountId: 'acc_001',
    name: 'Liam',
    type: 'teen',
    avatarColor: '#8B5CF6',
    avatarEmoji: '🧑',
    isActive: true,
    deviceCount: 2,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-05-18T14:30:00Z',
  },
  {
    id: 'prof_003',
    accountId: 'acc_001',
    name: 'John (Work)',
    type: 'adult_self',
    avatarColor: '#22C55E',
    avatarEmoji: '🧑‍💼',
    isActive: true,
    deviceCount: 1,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-06-01T07:00:00Z',
  },
  {
    id: 'prof_004',
    accountId: 'acc_001',
    name: 'John (Personal)',
    type: 'adult_unrestricted',
    avatarColor: '#0EA5E9',
    avatarEmoji: '👤',
    isActive: false,
    deviceCount: 1,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-06-01T07:00:00Z',
  },
];

export const mockRules: Record<string, CategoryRule[]> = {
  prof_001: [
    { id: 'r001', profileId: 'prof_001', category: 'social_media', action: 'block' },
    { id: 'r002', profileId: 'prof_001', category: 'adult_content', action: 'block' },
    { id: 'r003', profileId: 'prof_001', category: 'gaming', action: 'limit', dailyLimitMinutes: 60 },
    { id: 'r004', profileId: 'prof_001', category: 'streaming', action: 'limit', dailyLimitMinutes: 90 },
    { id: 'r005', profileId: 'prof_001', category: 'gambling', action: 'block' },
    { id: 'r006', profileId: 'prof_001', category: 'education', action: 'allow' },
    { id: 'r007', profileId: 'prof_001', category: 'productivity', action: 'allow' },
    { id: 'r008', profileId: 'prof_001', category: 'communication', action: 'allow' },
    { id: 'r009', profileId: 'prof_001', category: 'news', action: 'block' },
    { id: 'r010', profileId: 'prof_001', category: 'shopping', action: 'block' },
  ],
  prof_002: [
    { id: 'r011', profileId: 'prof_002', category: 'social_media', action: 'limit', dailyLimitMinutes: 120 },
    { id: 'r012', profileId: 'prof_002', category: 'adult_content', action: 'block' },
    { id: 'r013', profileId: 'prof_002', category: 'gaming', action: 'limit', dailyLimitMinutes: 120 },
    { id: 'r014', profileId: 'prof_002', category: 'gambling', action: 'block' },
    { id: 'r015', profileId: 'prof_002', category: 'streaming', action: 'allow' },
    { id: 'r016', profileId: 'prof_002', category: 'education', action: 'allow' },
  ],
  prof_003: [
    { id: 'r017', profileId: 'prof_003', category: 'social_media', action: 'block' },
    { id: 'r018', profileId: 'prof_003', category: 'news', action: 'block' },
    { id: 'r019', profileId: 'prof_003', category: 'shopping', action: 'block' },
    { id: 'r020', profileId: 'prof_003', category: 'productivity', action: 'allow' },
    { id: 'r021', profileId: 'prof_003', category: 'education', action: 'allow' },
  ],
};

export const mockSiteOverrides: Record<string, SiteOverride[]> = {
  prof_001: [
    { id: 'so001', profileId: 'prof_001', url: 'khanacademy.org', action: 'allow', addedAt: '2026-02-10T10:00:00Z' },
    { id: 'so002', profileId: 'prof_001', url: 'minecraft.net', action: 'allow', addedAt: '2026-03-01T12:00:00Z' },
    { id: 'so003', profileId: 'prof_001', url: 'roblox.com', action: 'block', addedAt: '2026-04-15T09:00:00Z' },
  ],
};

export const mockSchedules: Record<string, Schedule[]> = {
  prof_001: [
    {
      id: 'sch001',
      profileId: 'prof_001',
      label: 'School Hours',
      days: [1, 2, 3, 4, 5],
      startTime: '08:00',
      endTime: '15:00',
      action: 'block',
      categories: ['gaming', 'streaming', 'social_media'],
    },
    {
      id: 'sch002',
      profileId: 'prof_001',
      label: 'Bedtime',
      days: [0, 1, 2, 3, 4, 5, 6],
      startTime: '21:00',
      endTime: '07:00',
      action: 'block',
      categories: ['gaming', 'streaming', 'social_media', 'communication'],
    },
  ],
  prof_003: [
    {
      id: 'sch003',
      profileId: 'prof_003',
      label: 'Work Hours',
      days: [1, 2, 3, 4, 5],
      startTime: '09:00',
      endTime: '18:00',
      action: 'block',
      categories: ['social_media', 'news', 'shopping', 'streaming'],
    },
  ],
};

export const mockDevices: Device[] = [
  { id: 'dev_001', accountId: 'acc_001', profileId: 'prof_001', deviceName: "Emma's iPad", platform: 'ios', lastSeen: '2026-06-02T09:15:00Z', isOnline: true, osVersion: 'iOS 18.1' },
  { id: 'dev_002', accountId: 'acc_001', profileId: 'prof_001', deviceName: "Emma's iPhone", platform: 'ios', lastSeen: '2026-06-02T09:00:00Z', isOnline: true, osVersion: 'iOS 18.1' },
  { id: 'dev_003', accountId: 'acc_001', profileId: 'prof_002', deviceName: "Liam's Phone", platform: 'android', lastSeen: '2026-06-02T08:45:00Z', isOnline: true, osVersion: 'Android 15' },
  { id: 'dev_004', accountId: 'acc_001', profileId: 'prof_002', deviceName: "Liam's Laptop", platform: 'windows', lastSeen: '2026-06-01T22:00:00Z', isOnline: false, osVersion: 'Windows 11' },
  { id: 'dev_005', accountId: 'acc_001', profileId: 'prof_003', deviceName: "John's MacBook", platform: 'macos', lastSeen: '2026-06-02T09:20:00Z', isOnline: true, osVersion: 'macOS 15.2' },
  { id: 'dev_006', accountId: 'acc_001', profileId: 'prof_004', deviceName: "John's iPhone", platform: 'ios', lastSeen: '2026-06-02T07:30:00Z', isOnline: false, osVersion: 'iOS 18.1' },
];

export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'req_001',
    profileId: 'prof_001',
    profileName: 'Emma',
    profileEmoji: '🧒',
    url: 'youtube.com/shorts',
    siteName: 'YouTube Shorts',
    category: 'streaming',
    status: 'pending',
    requestedAt: '2026-06-02T09:10:00Z',
    note: 'I need to watch a video for homework',
  },
  {
    id: 'req_002',
    profileId: 'prof_002',
    profileName: 'Liam',
    profileEmoji: '🧑',
    url: 'instagram.com',
    siteName: 'Instagram',
    category: 'social_media',
    status: 'pending',
    requestedAt: '2026-06-02T08:30:00Z',
    note: 'I want to talk to my friends',
  },
  {
    id: 'req_003',
    profileId: 'prof_001',
    profileName: 'Emma',
    profileEmoji: '🧒',
    url: 'roblox.com',
    siteName: 'Roblox',
    category: 'gaming',
    status: 'approved',
    requestedAt: '2026-06-01T15:00:00Z',
    expiresAt: '2026-06-01T17:00:00Z',
  },
];

export const mockUsageReports: Record<string, UsageReport> = {
  prof_001: {
    profileId: 'prof_001',
    period: 'week',
    startDate: '2026-05-26',
    endDate: '2026-06-01',
    totalMinutes: 847,
    blockedCount: 43,
    allowedCount: 612,
    categoryBreakdown: [
      { category: 'education', minutes: 280, percentage: 33, blocked: 0 },
      { category: 'streaming', minutes: 220, percentage: 26, blocked: 5 },
      { category: 'gaming', minutes: 180, percentage: 21, blocked: 12 },
      { category: 'communication', minutes: 120, percentage: 14, blocked: 0 },
      { category: 'productivity', minutes: 47, percentage: 6, blocked: 0 },
    ],
    topSites: [
      { domain: 'khanacademy.org', minutes: 145, visitCount: 28, blocked: false },
      { domain: 'youtube.com', minutes: 120, visitCount: 45, blocked: false },
      { domain: 'minecraft.net', minutes: 95, visitCount: 12, blocked: false },
      { domain: 'roblox.com', minutes: 0, visitCount: 8, blocked: true },
      { domain: 'tiktok.com', minutes: 0, visitCount: 15, blocked: true },
    ],
    dailyTrend: [
      { date: '2026-05-26', minutes: 95, blocked: 4 },
      { date: '2026-05-27', minutes: 140, blocked: 8 },
      { date: '2026-05-28', minutes: 62, blocked: 2 },
      { date: '2026-05-29', minutes: 178, blocked: 11 },
      { date: '2026-05-30', minutes: 134, blocked: 7 },
      { date: '2026-05-31', minutes: 120, blocked: 6 },
      { date: '2026-06-01', minutes: 118, blocked: 5 },
    ],
  },
  prof_002: {
    profileId: 'prof_002',
    period: 'week',
    startDate: '2026-05-26',
    endDate: '2026-06-01',
    totalMinutes: 1240,
    blockedCount: 28,
    allowedCount: 890,
    categoryBreakdown: [
      { category: 'streaming', minutes: 420, percentage: 34, blocked: 0 },
      { category: 'social_media', minutes: 320, percentage: 26, blocked: 8 },
      { category: 'gaming', minutes: 280, percentage: 22, blocked: 5 },
      { category: 'education', minutes: 140, percentage: 11, blocked: 0 },
      { category: 'communication', minutes: 80, percentage: 7, blocked: 0 },
    ],
    topSites: [
      { domain: 'youtube.com', minutes: 280, visitCount: 95, blocked: false },
      { domain: 'twitch.tv', minutes: 140, visitCount: 22, blocked: false },
      { domain: 'instagram.com', minutes: 180, visitCount: 68, blocked: false },
      { domain: 'tiktok.com', minutes: 0, visitCount: 42, blocked: true },
    ],
    dailyTrend: [
      { date: '2026-05-26', minutes: 160, blocked: 3 },
      { date: '2026-05-27', minutes: 210, blocked: 5 },
      { date: '2026-05-28', minutes: 145, blocked: 2 },
      { date: '2026-05-29', minutes: 195, blocked: 6 },
      { date: '2026-05-30', minutes: 220, blocked: 7 },
      { date: '2026-05-31', minutes: 175, blocked: 4 },
      { date: '2026-06-01', minutes: 135, blocked: 1 },
    ],
  },
};

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif_001',
    type: 'access_request',
    title: 'Emma requested access',
    body: 'Requesting temporary access to YouTube Shorts',
    read: false,
    createdAt: '2026-06-02T09:10:00Z',
    accessRequestId: 'req_001',
  },
  {
    id: 'notif_002',
    type: 'access_request',
    title: 'Liam requested access',
    body: 'Requesting temporary access to Instagram',
    read: false,
    createdAt: '2026-06-02T08:30:00Z',
    accessRequestId: 'req_002',
  },
  {
    id: 'notif_003',
    type: 'limit_reached',
    title: "Emma reached her gaming limit",
    body: "Used up today's 60-minute gaming allowance",
    read: true,
    createdAt: '2026-06-01T16:45:00Z',
  },
  {
    id: 'notif_004',
    type: 'weekly_report',
    title: 'Weekly report is ready',
    body: "Last week's usage summary is available",
    read: true,
    createdAt: '2026-06-01T08:00:00Z',
  },
  {
    id: 'notif_005',
    type: 'tamper_attempt',
    title: 'Tamper attempt detected',
    body: "Someone tried to disable Guardian on Liam's device",
    read: false,
    createdAt: '2026-05-31T20:12:00Z',
  },
];

export const mockBlockEvents: BlockEvent[] = [
  { id: 'be001', profileId: 'prof_001', deviceId: 'dev_001', url: 'tiktok.com', category: 'social_media', action: 'blocked', timestamp: '2026-06-02T08:55:00Z' },
  { id: 'be002', profileId: 'prof_001', deviceId: 'dev_001', url: 'roblox.com', category: 'gaming', action: 'blocked', timestamp: '2026-06-02T08:40:00Z' },
  { id: 'be003', profileId: 'prof_002', deviceId: 'dev_003', url: 'tiktok.com', category: 'social_media', action: 'blocked', timestamp: '2026-06-02T07:50:00Z' },
];

export const mockClassificationSimulator = [
  { url: 'instagram.com', categories: ['social_media' as const], confidence: 0.99, method: 'dns' as const },
  { url: 'khanacademy.org', categories: ['education' as const], confidence: 0.98, method: 'dns' as const },
  { url: 'youtube.com/shorts', categories: ['streaming' as const, 'social_media' as const], confidence: 0.87, method: 'pattern' as const },
  { url: 'randomnewblog.com', categories: ['news' as const], confidence: 0.72, method: 'ai' as const },
];
