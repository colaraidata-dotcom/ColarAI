export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileType = 'child' | 'teen' | 'adult_self' | 'adult_unrestricted';
export type ContentType = 'movie' | 'series';
export type StreamingPlatform = 'netflix' | 'disney' | 'prime' | 'apple' | 'hbo';
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
  | 'tamper_attempt'
  | 'harm_signal';
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
          is_paused: boolean
          pause_until: string | null
          override_delay_minutes: number
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
          is_paused?: boolean
          pause_until?: string | null
          override_delay_minutes?: number
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
          is_paused?: boolean
          pause_until?: string | null
          override_delay_minutes?: number
          daily_limit_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pending_overrides: {
        Row: {
          id: string
          profile_id: string
          category: string
          new_action: RuleAction
          new_daily_limit_minutes: number | null
          apply_at: string
          applied: boolean
          created_at: string
        }
        Insert: {
          id: string
          profile_id: string
          category: string
          new_action: RuleAction
          new_daily_limit_minutes?: number | null
          apply_at: string
          applied?: boolean
          created_at?: string
        }
        Update: {
          applied?: boolean
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
      content_catalog: {
        Row: {
          id: string
          tmdb_id: number
          content_type: ContentType
          title: string
          original_title: string | null
          description: string | null
          release_year: number | null
          genres: string[]
          poster_url: string | null
          backdrop_url: string | null
          tmdb_rating: number | null
          tmdb_vote_count: number
          runtime_minutes: number | null
          age_rating: string | null
          platforms: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          tmdb_id: number
          content_type: ContentType
          title: string
          original_title?: string | null
          description?: string | null
          release_year?: number | null
          genres?: string[]
          poster_url?: string | null
          backdrop_url?: string | null
          tmdb_rating?: number | null
          tmdb_vote_count?: number
          runtime_minutes?: number | null
          age_rating?: string | null
          platforms?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          genres?: string[]
          poster_url?: string | null
          backdrop_url?: string | null
          tmdb_rating?: number | null
          tmdb_vote_count?: number
          platforms?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      content_scores: {
        Row: {
          content_id: string
          violence: number
          language: number
          sexual_content: number
          fear_factor: number
          substance_use: number
          themes: Json
          recommended_min_age: number
          guardian_safe_age: number
          data_sources: string[]
          scored_at: string
          score_version: number
        }
        Insert: {
          content_id: string
          violence?: number
          language?: number
          sexual_content?: number
          fear_factor?: number
          substance_use?: number
          themes?: Json
          recommended_min_age?: number
          guardian_safe_age?: number
          data_sources?: string[]
          scored_at?: string
          score_version?: number
        }
        Update: {
          violence?: number
          language?: number
          sexual_content?: number
          fear_factor?: number
          substance_use?: number
          themes?: Json
          recommended_min_age?: number
          guardian_safe_age?: number
          data_sources?: string[]
          scored_at?: string
          score_version?: number
        }
        Relationships: []
      }
      platform_availability: {
        Row: {
          id: number
          content_id: string
          platform: StreamingPlatform
          deep_link: string | null
          countries: string[]
          updated_at: string
        }
        Insert: {
          content_id: string
          platform: StreamingPlatform
          deep_link?: string | null
          countries?: string[]
        }
        Update: {
          deep_link?: string | null
          countries?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      content_criteria: {
        Row: {
          profile_id: string
          max_violence: number
          max_language: number
          max_sexual_content: number
          max_fear_factor: number
          max_substance_use: number
          allowed_genres: string[]
          blocked_themes: string[]
          allowed_platforms: string[]
          min_fit_score: number
          updated_at: string
        }
        Insert: {
          profile_id: string
          max_violence?: number
          max_language?: number
          max_sexual_content?: number
          max_fear_factor?: number
          max_substance_use?: number
          allowed_genres?: string[]
          blocked_themes?: string[]
          allowed_platforms?: string[]
          min_fit_score?: number
        }
        Update: {
          max_violence?: number
          max_language?: number
          max_sexual_content?: number
          max_fear_factor?: number
          max_substance_use?: number
          allowed_genres?: string[]
          blocked_themes?: string[]
          allowed_platforms?: string[]
          min_fit_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      sign_in_attempts: {
        Row: {
          id: number
          key: string
          attempted_at: string
        }
        Insert: {
          key: string
          attempted_at?: string
        }
        Update: {
          key?: string
          attempted_at?: string
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
