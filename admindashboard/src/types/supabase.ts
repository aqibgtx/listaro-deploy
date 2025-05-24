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
      listings: {
        Row: {
          created_at: string | null
          description: string
          fb_url: string | null
          id: string
          images: string[]
          original_id: string | null
          posted: boolean
          price: number
          price_mod: number | null
          prompt_desc: string | null
          prompt_title: string | null
          status: string
          title: string
          user_id: string | null
          branch: string
        }
        Insert: {
          created_at?: string | null
          description: string
          fb_url?: string | null
          id?: string
          images?: string[]
          original_id?: string | null
          posted?: boolean
          price: number
          price_mod?: number | null
          prompt_desc?: string | null
          prompt_title?: string | null
          status?: string
          title: string
          user_id?: string | null
          branch: string
        }
        Update: {
          created_at?: string | null
          description?: string
          fb_url?: string | null
          id?: string
          images?: string[]
          original_id?: string | null
          posted?: boolean
          price?: number
          price_mod?: number | null
          prompt_desc?: string | null
          prompt_title?: string | null
          status?: string
          title?: string
          user_id?: string | null
          branch?: string
        }
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