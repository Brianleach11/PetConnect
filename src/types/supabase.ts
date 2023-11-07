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
          receiving_user: string
          sending_user: string
        }
        Insert: {
          created_at?: string
          id?: number
          receiving_user: string
          sending_user: string
        }
        Update: {
          created_at?: string
          id?: number
          receiving_user?: string
          sending_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiving_user_fkey"
            columns: ["receiving_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sending_user_fkey"
            columns: ["sending_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      friends: {
        Row: {
          created_at: string
          id: number
          receiving_user: string
          sending_user: string
        }
        Insert: {
          created_at?: string
          id?: number
          receiving_user: string
          sending_user: string
        }
        Update: {
          created_at?: string
          id?: number
          receiving_user?: string
          sending_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_receiving_user_fkey"
            columns: ["receiving_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_sending_user_fkey"
            columns: ["sending_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          chat_id: string | null
          created_at: string
          deleted_by: string | null
          id: number
          message_content: string | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          chat_id?: string | null
          created_at?: string
          deleted_by?: string | null
          id?: number
          message_content?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          chat_id?: string | null
          created_at?: string
          deleted_by?: string | null
          id?: number
          message_content?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          message_content: string | null
          message_id: number | null
          receiving_user: string | null
          seen: boolean | null
          sending_user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message_content?: string | null
          message_id?: number | null
          receiving_user?: string | null
          seen?: boolean | null
          sending_user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message_content?: string | null
          message_id?: number | null
          receiving_user?: string | null
          seen?: boolean | null
          sending_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_receiving_user_fkey"
            columns: ["receiving_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sending_user_fkey"
            columns: ["sending_user"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      pet: {
        Row: {
          bio: string | null
          birthday: string | null
          breed: string | null
          color: string | null
          fixed: boolean | null
          id: number
          name: string | null
          owner_id: string | null
          pet_type: string
          picture: string | null
          sex: string | null
          weight: number | null
        }
        Insert: {
          bio?: string | null
          birthday?: string | null
          breed?: string | null
          color?: string | null
          fixed?: boolean | null
          id?: number
          name?: string | null
          owner_id?: string | null
          pet_type: string
          picture?: string | null
          sex?: string | null
          weight?: number | null
        }
        Update: {
          bio?: string | null
          birthday?: string | null
          breed?: string | null
          color?: string | null
          fixed?: boolean | null
          id?: number
          name?: string | null
          owner_id?: string | null
          pet_type?: string
          picture?: string | null
          sex?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
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
          filter_city: string | null
          filter_state: string
          gender: string | null
          id: string
          looking_for: string
          state: string | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          birthday?: string | null
          city?: string | null
          filter_city?: string | null
          filter_state?: string
          gender?: string | null
          id: string
          looking_for?: string
          state?: string | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          birthday?: string | null
          city?: string | null
          filter_city?: string | null
          filter_state?: string
          gender?: string | null
          id?: string
          looking_for?: string
          state?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            isOneToOne: true
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
            isOneToOne: false
            referencedRelation: "pet"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      chats: {
        Row: {
          chat_id: string | null
          created_at: string | null
          deleted_by: string | null
          message_content: string | null
          recipient_id: string | null
          sender_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recent_messages: {
        Row: {
          chat_id: string | null
          created_at: string | null
          deleted_by: string | null
          message_content: string | null
          recipient_id: string | null
          recipient_username: string | null
          sender_id: string | null
          sender_username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      delete_chat_for_user: {
        Args: {
          deletinguser: string
          deletingchat: string
        }
        Returns: undefined
      }
    }
    Enums: {
      Filter: "City" | "State" | "Any"
      Filtration: "Any" | "City" | "State" | "Looking_For"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
