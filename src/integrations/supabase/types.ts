export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      creator_profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_accounts: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          handle: string;
          platform_user_id: string | null;
          connected: boolean;
          followers: number;
          change_percent: number;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          handle: string;
          platform_user_id?: string | null;
          connected?: boolean;
          followers?: number;
          change_percent?: number;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          handle?: string;
          platform_user_id?: string | null;
          connected?: boolean;
          followers?: number;
          change_percent?: number;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_posts: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          platform_post_id: string;
          title: string;
          format: string | null;
          published_at: string;
          views: number;
          likes: number;
          comments: number;
          shares: number;
          saves: number;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          platform_post_id: string;
          title: string;
          format?: string | null;
          published_at: string;
          views?: number;
          likes?: number;
          comments?: number;
          shares?: number;
          saves?: number;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          platform_post_id?: string;
          title?: string;
          format?: string | null;
          published_at?: string;
          views?: number;
          likes?: number;
          comments?: number;
          shares?: number;
          saves?: number;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      follower_snapshots: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          snapshot_date: string;
          followers: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          snapshot_date: string;
          followers: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          snapshot_date?: string;
          followers?: number;
          created_at?: string;
        };
      };
      audience_snapshots: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          snapshot_date: string;
          age_groups: Json;
          gender: Json;
          countries: Json;
          best_times: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          snapshot_date: string;
          age_groups: Json;
          gender: Json;
          countries: Json;
          best_times?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          snapshot_date?: string;
          age_groups?: Json;
          gender?: Json;
          countries?: Json;
          best_times?: Json | null;
          created_at?: string;
        };
      };
      ai_insights: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          impact: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          impact: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          impact?: string;
          active?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
