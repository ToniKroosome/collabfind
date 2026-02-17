export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          niche: string[]
          follower_count_min: number
          follower_count_max: number
          instagram_url: string | null
          tiktok_url: string | null
          youtube_url: string | null
          twitter_url: string | null
          location: string | null
          is_profile_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          niche?: string[]
          follower_count_min?: number
          follower_count_max?: number
          instagram_url?: string | null
          tiktok_url?: string | null
          youtube_url?: string | null
          twitter_url?: string | null
          location?: string | null
          is_profile_complete?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          niche?: string[]
          follower_count_min?: number
          follower_count_max?: number
          instagram_url?: string | null
          tiktok_url?: string | null
          youtube_url?: string | null
          twitter_url?: string | null
          location?: string | null
          is_profile_complete?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      collab_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          collab_type: string
          niche_tags: string[]
          preferred_audience_min: number
          preferred_audience_max: number
          location: string | null
          is_open: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          collab_type: string
          niche_tags?: string[]
          preferred_audience_min?: number
          preferred_audience_max?: number
          location?: string | null
          is_open?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          collab_type?: string
          niche_tags?: string[]
          preferred_audience_min?: number
          preferred_audience_max?: number
          location?: string | null
          is_open?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collab_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      interests: {
        Row: {
          id: string
          post_id: string
          user_id: string
          message: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interests_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "collab_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      matches: {
        Row: {
          id: string
          interest_id: string
          post_id: string
          user_a: string
          user_b: string
          created_at: string
        }
        Insert: {
          id?: string
          interest_id: string
          post_id: string
          user_a: string
          user_b: string
          created_at?: string
        }
        Update: {
          id?: string
          interest_id?: string
          post_id?: string
          user_a?: string
          user_b?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: true
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "collab_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string | null
          data: Json
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body?: string | null
          data?: Json
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          body?: string | null
          data?: Json
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type CollabPost = Database['public']['Tables']['collab_posts']['Row']
export type Interest = Database['public']['Tables']['interests']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// Joined types for queries
export interface CollabPostWithProfile extends CollabPost {
  profiles: Profile
}

export interface InterestWithProfile extends Interest {
  profiles: Profile
}

export interface MatchWithDetails extends Match {
  collab_posts: CollabPost
  partner_a: Profile
  partner_b: Profile
}
