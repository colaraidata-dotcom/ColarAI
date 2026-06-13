export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileType = 'child' | 'teen' | 'adult_self' | 'adult_unrestricted';
export type RuleAction = 'allow' | 'block' | 'limit';
export type ScheduleAction = 'block_all' | 'allow_all';
export type DevicePlatform = 'ios' | 'android' | 'macos' | 'windows';
export type AccessRequestStatus = 'pending' | 'approved' | 'denied';
export type DnsAction = 'allowed' | 'blocked' | 'limited';
export type NotificationType =
  | 'access_request'
  | 'weekly_report'
  | 'device_added'
  | 'limit_reached'
  | 'tamper_attempt';
export type SubscriptionTier = 'free' | 'basic' | 'family';

export interface Database {
  public: {
    Tables: {
      account_settings: {
        Row: {
          id: string
          display_name: string | null
          notification_prefs: Json
          subscription_tier: SubscriptionTier
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          notification_prefs?: Json
          subscription_tier?: SubscriptionTier
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          notification_prefs?: Json
          subscription_tier?: SubscriptionTier
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          account_id: string
          display_name: string
          type: ProfileType
          avatar_emoji: string
          avatar_color: string
          is_active: boolean
          daily_limit_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          account_id: string
          display_name: string
          type: ProfileType
          avatar_emoji?: string
          avatar_color?: string
          is_active?: boolean
          daily_limit_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string
          type?: ProfileType
          avatar_emoji?: string
          avatar_color?: string
          is_active?: boolean
          daily_limit_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      devices: {
        Row: {
          id: string
          profile_id: string | null
          account_id: string
          display_name: string
          platform: DevicePlatform
          device_token: string | null
          is_online: boolean
          last_seen_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          account_id: string
          display_name: string
          platform: DevicePlatform
          profile_id?: string | null
          device_token?: string | null
          is_online?: boolean
          last_seen_at?: string | null
          created_at?: string
        }
        Update: {
          profile_id?: string | null
          display_name?: string
          is_online?: boolean
          last_seen_at?: string | null
        }
        Relationships: []
      }
      content_rules: {
        Row: {
          id: string
          profile_id: string
          category: string
          action: RuleAction
          daily_limit_minutes: number | null
          created_at: string
        }
        Insert: {
          id: string
          profile_id: string
          category: string
          action: RuleAction
          daily_limit_minutes?: number | null
          created_at?: string
        }
        Update: {
          action?: RuleAction
          daily_limit_minutes?: number | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          id: string
          profile_id: string
          label: string
          start_time: string
          end_time: string
          days: string[]
          action: ScheduleAction
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          profile_id: string
          label: string
          start_time: string
          end_time: string
          days: string[]
          action: ScheduleAction
          is_active?: boolean
          created_at?: string
        }
        Update: {
          label?: string
          start_time?: string
          end_time?: string
          days?: string[]
          action?: ScheduleAction
          is_active?: boolean
        }
        Relationships: []
      }
      site_overrides: {
        Row: {
          id: string
          profile_id: string
          domain: string
          action: RuleAction
          created_at: string
        }
        Insert: {
          id: string
          profile_id: string
          domain: string
          action: RuleAction
          created_at?: string
        }
        Update: {
          action?: RuleAction
        }
        Relationships: []
      }
      access_logs: {
        Row: {
          id: number
          device_id: string | null
          profile_id: string | null
          domain_hash: string
          domain: string | null
          action: DnsAction
          category: string | null
          created_at: string
        }
        Insert: {
          device_id?: string | null
          profile_id?: string | null
          domain_hash: string
          domain?: string | null
          action: DnsAction
          category?: string | null
          created_at?: string
        }
        Update: {
          [key: string]: never
        }
        Relationships: []
      }
      access_requests: {
        Row: {
          id: string
          device_id: string | null
          profile_id: string | null
          account_id: string
          domain: string
          reason: string | null
          status: AccessRequestStatus
          responded_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          account_id: string
          domain: string
          device_id?: string | null
          profile_id?: string | null
          reason?: string | null
          status?: AccessRequestStatus
          responded_at?: string | null
          created_at?: string
        }
        Update: {
          status?: AccessRequestStatus
          responded_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          account_id: string
          type: NotificationType
          title: string
          body: string
          is_read: boolean
          related_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          account_id: string
          type: NotificationType
          title: string
          body: string
          is_read?: boolean
          related_id?: string | null
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
