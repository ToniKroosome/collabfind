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
          facebook_url: string | null
          location: string | null
          is_profile_complete: boolean
          instagram_verified: boolean
          tiktok_verified: boolean
          youtube_verified: boolean
          twitter_verified: boolean
          facebook_verified: boolean
          is_admin: boolean
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
          facebook_url?: string | null
          location?: string | null
          is_profile_complete?: boolean
          instagram_verified?: boolean
          tiktok_verified?: boolean
          youtube_verified?: boolean
          twitter_verified?: boolean
          facebook_verified?: boolean
          is_admin?: boolean
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
          facebook_url?: string | null
          location?: string | null
          is_profile_complete?: boolean
          instagram_verified?: boolean
          tiktok_verified?: boolean
          youtube_verified?: boolean
          twitter_verified?: boolean
          facebook_verified?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_verifications: {
        Row: {
          id: string
          user_id: string
          platform: string
          code: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          code: string
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          code?: string
          created_at?: string
          expires_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
          timeline: string | null
          deliverables: string | null
          deliverable_slots: Json | null
          requirements: string | null
          compensation: string | null
          video_resolution: string | null
          reference_link: string | null
          edit_level: string | null
          image_url: string | null
          is_open: boolean
          max_collaborators: number
          collab_mode: string
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
          timeline?: string | null
          deliverables?: string | null
          deliverable_slots?: Json | null
          requirements?: string | null
          compensation?: string | null
          video_resolution?: string | null
          reference_link?: string | null
          edit_level?: string | null
          image_url?: string | null
          is_open?: boolean
          max_collaborators?: number
          collab_mode?: string
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
          timeline?: string | null
          deliverables?: string | null
          deliverable_slots?: Json | null
          requirements?: string | null
          compensation?: string | null
          video_resolution?: string | null
          reference_link?: string | null
          edit_level?: string | null
          image_url?: string | null
          is_open?: boolean
          max_collaborators?: number
          collab_mode?: string
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
          members: string[]
          collab_mode: string
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          interest_id: string
          post_id: string
          user_a: string
          user_b: string
          members?: string[]
          collab_mode?: string
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          interest_id?: string
          post_id?: string
          user_a?: string
          user_b?: string
          members?: string[]
          collab_mode?: string
          status?: 'active' | 'completed' | 'cancelled'
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
      collab_reviews: {
        Row: {
          id: string
          match_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          review_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          review_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          review_text?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collab_reviews_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collab_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collab_reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
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
      collab_contracts: {
        Row: {
          id: string
          match_id: string
          created_by: string
          title: string
          requirements_a: string
          requirements_b: string
          deadline: string
          notes: string | null
          status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
          responded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          created_by: string
          title: string
          requirements_a: string
          requirements_b: string
          deadline: string
          notes?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          created_by?: string
          title?: string
          requirements_a?: string
          requirements_b?: string
          deadline?: string
          notes?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collab_contracts_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collab_contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      contract_submissions: {
        Row: {
          id: string
          contract_id: string
          submitted_by: string
          description: string
          proof_url: string | null
          status: 'pending' | 'approved' | 'revision_requested'
          revision_note: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          submitted_by: string
          description: string
          proof_url?: string | null
          status?: 'pending' | 'approved' | 'revision_requested'
          revision_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          submitted_by?: string
          description?: string
          proof_url?: string | null
          status?: 'pending' | 'approved' | 'revision_requested'
          revision_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_submissions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "collab_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      storyboards: {
        Row: {
          id: string
          match_id: string
          post_id: string | null
          created_by: string
          slots: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          post_id?: string | null
          created_by: string
          slots?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          post_id?: string | null
          created_by?: string
          slots?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storyboards_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storyboards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      page_views: {
        Row: {
          id: string
          path: string
          visitor_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          path: string
          visitor_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          path?: string
          visitor_id?: string | null
          viewed_at?: string
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

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type CollabPost = Database['public']['Tables']['collab_posts']['Row']
export type Interest = Database['public']['Tables']['interests']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type CollabReview = Database['public']['Tables']['collab_reviews']['Row']

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

export interface CollabReviewWithProfile extends CollabReview {
  profiles: Profile
}

export type CollabContract = Database['public']['Tables']['collab_contracts']['Row']
export type ContractSubmission = Database['public']['Tables']['contract_submissions']['Row']
export type Storyboard = Database['public']['Tables']['storyboards']['Row']

export interface DrawingStroke {
  points: number[] // Flat [x1,y1,x2,y2,...] normalized to 0-1
  color: string
  width: number
}

export interface StoryboardSlot {
  order: number
  description: string
  assigned_to: string // user_id of the assigned person
  drawing?: DrawingStroke[]
}

export interface DeliverableSlot {
  content_type: string // video, photo, reel, story, post, blog, etc.
  quantity: string // 1, 2, 3, etc.
  description: string // specific details
}

export interface ContractWithSubmissions extends CollabContract {
  contract_submissions: ContractSubmission[]
}

export type CollabMode = 'separate' | 'group'

export interface CollabMember {
  id: string
  full_name: string | null
  avatar_url: string | null
}
