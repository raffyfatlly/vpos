export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      pending_invitations: {
        Row: {
          created_at: string
          email: string
          role: string
          used: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          role: string
          used?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          role?: string
          used?: boolean | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          id: number
          image: string | null
          name: string
          price: number
          variations: Json[] | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: number
          image?: string | null
          name: string
          price: number
          variations?: Json[] | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: number
          image?: string | null
          name?: string
          price?: number
          variations?: Json[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          username?: string | null
        }
        Relationships: []
      }
      session_inventory: {
        Row: {
          created_at: string | null
          current_stock: number | null
          id: number
          initial_stock: number | null
          product_id: number | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_stock?: number | null
          id?: number
          initial_stock?: number | null
          product_id?: number | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_stock?: number | null
          id?: number
          initial_stock?: number | null
          product_id?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_inventory_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_sales: {
        Row: {
          created_at: string | null
          id: string
          price_at_time: number
          product_id: number | null
          quantity: number
          session_id: string | null
          total: number
        }
        Insert: {
          created_at?: string | null
          id: string
          price_at_time: number
          product_id?: number | null
          quantity: number
          session_id?: string | null
          total: number
        }
        Update: {
          created_at?: string | null
          id?: string
          price_at_time?: number
          product_id?: number | null
          quantity?: number
          session_id?: string | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_sales_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          date: string
          id: string
          location: string
          name: string
          status: Database["public"]["Enums"]["session_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id: string
          location: string
          name: string
          status?: Database["public"]["Enums"]["session_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          location?: string
          name?: string
          status?: Database["public"]["Enums"]["session_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_new_current_stock: {
        Args: {
          product_id: number
          new_initial_stock: number
        }
        Returns: number
      }
    }
    Enums: {
      session_status: "active" | "completed" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
