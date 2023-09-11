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
          birthday: string | null
          breed: string | null
          fixed: boolean | null
          id: number
          name: string | null
          owner_id: string | null
          pet_type: string
          sex: string | null
        }
        Insert: {
          birthday?: string | null
          breed?: string | null
          fixed?: boolean | null
          id?: number
          name?: string | null
          owner_id?: string | null
          pet_type: string
          sex?: string | null
        }
        Update: {
          birthday?: string | null
          breed?: string | null
          fixed?: boolean | null
          id?: number
          name?: string | null
          owner_id?: string | null
          pet_type?: string
          sex?: string | null
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
      username: {
        Row: {
          id: string
          username: string | null
        }
        Insert: {
          id: string
          username?: string | null
        }
        Update: {
          id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "username_id_fkey"
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
