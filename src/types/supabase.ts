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
      friend_requests: {
        Row: {
          created_at: string
          id: number
          receiving_user: string | null
          sending_user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          receiving_user?: string | null
          sending_user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          receiving_user?: string | null
          sending_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiving_user_fkey"
            columns: ["receiving_user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sending_user_fkey"
            columns: ["sending_user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      friends: {
        Row: {
          created_at: string
          id: number
          receiving_user: string | null
          sending_user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          receiving_user?: string | null
          sending_user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          receiving_user?: string | null
          sending_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friends_receiving_user_fkey"
            columns: ["receiving_user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_sending_user_fkey"
            columns: ["sending_user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: number
          message_content: string | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message_content?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message_content?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pet: {
        Row: {
          bio: string | null
          birthday: string | null
          breed: string | null
          fixed: boolean | null
          id: number
          name: string | null
          owner_id: string | null
          pet_type: string
          picture: string | null
          sex: string | null
          weight: number | null
          color: string | null
        }
        Insert: {
          bio?: string | null
          birthday?: string | null
          breed?: string | null
          fixed?: boolean | null
          id?: number
          name?: string | null
          owner_id?: string | null
          pet_type: string
          picture?: string | null
          sex?: string | null
          weight?: number | null
          color?: string | null

        }
        Update: {
          bio?: string | null
          birthday?: string | null
          breed?: string | null
          fixed?: boolean | null
          id?: number
          name?: string | null
          owner_id?: string | null
          pet_type?: string
          picture?: string | null
          sex?: string | null
          weight?: number | null
          color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user: {
        Row: {
          bio: string | null
          birthday: string | null
          city: string | null
          gender: string | null
          id: string
          looking_for: string | null
          state: string | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          birthday?: string | null
          city?: string | null
          gender?: string | null
          id: string
          looking_for?: string | null
          state?: string | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          birthday?: string | null
          city?: string | null
          gender?: string | null
          id?: string
          looking_for?: string | null
          state?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      vaccination: {
        Row: {
          date_adminstered: string | null
          date_due: string | null
          id: number
          pet_id: number | null
          type: string | null
        }
        Insert: {
          date_adminstered?: string | null
          date_due?: string | null
          id: number
          pet_id?: number | null
          type?: string | null
        }
        Update: {
          date_adminstered?: string | null
          date_due?: string | null
          id?: number
          pet_id?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vaccination_pet_id_fkey"
            columns: ["pet_id"]
            referencedRelation: "pet"
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
