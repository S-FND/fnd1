export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      action_logs: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at: string
          description: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"]
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          portfolio_company_id: string
          request_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          portfolio_company_id: string
          request_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          portfolio_company_id?: string
          request_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_portfolio_company_id_fkey"
            columns: ["portfolio_company_id"]
            isOneToOne: false
            referencedRelation: "portfolio_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      autosave_drafts: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string
          form_data: Json
          id: string
          portfolio_company_id: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type: string
          form_data: Json
          id?: string
          portfolio_company_id: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          form_data?: Json
          id?: string
          portfolio_company_id?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "autosave_drafts_portfolio_company_id_fkey"
            columns: ["portfolio_company_id"]
            isOneToOne: false
            referencedRelation: "portfolio_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          change_summary: string | null
          content: string | null
          created_at: string
          created_by: string | null
          document_id: string
          file_size: number | null
          file_url: string | null
          id: string
          is_current: boolean | null
          mime_type: string | null
          title: string
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          document_id: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_current?: boolean | null
          mime_type?: string | null
          title: string
          version_number: number
        }
        Update: {
          change_summary?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_current?: boolean | null
          mime_type?: string | null
          title?: string
          version_number?: number
        }
        Relationships: []
      }
      esms_documents: {
        Row: {
          created_at: string
          document_id: string
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_not_applicable: boolean
          is_uploaded: boolean
          mime_type: string | null
          portfolio_company_id: string | null
          section_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_not_applicable?: boolean
          is_uploaded?: boolean
          mime_type?: string | null
          portfolio_company_id?: string | null
          section_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_not_applicable?: boolean
          is_uploaded?: boolean
          mime_type?: string | null
          portfolio_company_id?: string | null
          section_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      irl_data: {
        Row: {
          created_at: string
          field_key: string
          field_value: Json | null
          files: Json | null
          id: string
          portfolio_company_id: string | null
          section_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          field_key: string
          field_value?: Json | null
          files?: Json | null
          id?: string
          portfolio_company_id?: string | null
          section_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_value?: Json | null
          files?: Json | null
          id?: string
          portfolio_company_id?: string | null
          section_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      maker_checker_rules: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at: string
          entity_type: string
          id: string
          max_pending_hours: number | null
          min_checker_role: string
          requires_approval: boolean
        }
        Insert: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at?: string
          entity_type: string
          id?: string
          max_pending_hours?: number | null
          min_checker_role?: string
          requires_approval?: boolean
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"]
          created_at?: string
          entity_type?: string
          id?: string
          max_pending_hours?: number | null
          min_checker_role?: string
          requires_approval?: boolean
        }
        Relationships: []
      }
      pending_actions: {
        Row: {
          action_data: Json
          action_type: Database["public"]["Enums"]["action_type"]
          approved_at: string | null
          checker_comments: string | null
          checker_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          expires_at: string | null
          id: string
          maker_id: string
          original_data: Json | null
          reason: string | null
          status: Database["public"]["Enums"]["pending_status"]
          updated_at: string
        }
        Insert: {
          action_data: Json
          action_type: Database["public"]["Enums"]["action_type"]
          approved_at?: string | null
          checker_comments?: string | null
          checker_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          expires_at?: string | null
          id?: string
          maker_id: string
          original_data?: Json | null
          reason?: string | null
          status?: Database["public"]["Enums"]["pending_status"]
          updated_at?: string
        }
        Update: {
          action_data?: Json
          action_type?: Database["public"]["Enums"]["action_type"]
          approved_at?: string | null
          checker_comments?: string | null
          checker_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          expires_at?: string | null
          id?: string
          maker_id?: string
          original_data?: Json | null
          reason?: string | null
          status?: Database["public"]["Enums"]["pending_status"]
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_companies: {
        Row: {
          created_at: string
          id: string
          name: string
          settings: Json | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          settings?: Json | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          settings?: Json | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          action: string
          created_at: string
          granted: boolean | null
          id: string
          resource: string
          role: Database["public"]["Enums"]["portfolio_role"]
        }
        Insert: {
          action: string
          created_at?: string
          granted?: boolean | null
          id?: string
          resource: string
          role: Database["public"]["Enums"]["portfolio_role"]
        }
        Update: {
          action?: string
          created_at?: string
          granted?: boolean | null
          id?: string
          resource?: string
          role?: Database["public"]["Enums"]["portfolio_role"]
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          approved_at: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          invite_code: string | null
          is_active: boolean | null
          portfolio_company_id: string | null
          role: Database["public"]["Enums"]["portfolio_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          invite_code?: string | null
          is_active?: boolean | null
          portfolio_company_id?: string | null
          role: Database["public"]["Enums"]["portfolio_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          invite_code?: string | null
          is_active?: boolean | null
          portfolio_company_id?: string | null
          role?: Database["public"]["Enums"]["portfolio_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_portfolio_company_id_fkey"
            columns: ["portfolio_company_id"]
            isOneToOne: false
            referencedRelation: "portfolio_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          can_approve_actions: boolean | null
          can_make_actions: boolean | null
          created_at: string
          id: string
          max_approval_amount: number | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_approve_actions?: boolean | null
          can_make_actions?: boolean | null
          created_at?: string
          id?: string
          max_approval_amount?: number | null
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_approve_actions?: boolean | null
          can_make_actions?: boolean | null
          created_at?: string
          id?: string
          max_approval_amount?: number | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_document_version: {
        Args: {
          p_document_id: string
          p_title: string
          p_content?: string
          p_file_url?: string
          p_file_size?: number
          p_mime_type?: string
          p_change_summary?: string
        }
        Returns: string
      }
      get_user_company: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["portfolio_role"]
      }
      log_action: {
        Args: {
          p_action_type: Database["public"]["Enums"]["action_type"]
          p_entity_type: string
          p_entity_id?: string
          p_entity_name?: string
          p_description?: string
          p_metadata?: Json
        }
        Returns: string
      }
    }
    Enums: {
      action_type:
        | "create"
        | "update"
        | "delete"
        | "upload"
        | "download"
        | "view"
        | "share"
        | "restore"
      pending_status: "pending" | "approved" | "rejected" | "expired"
      portfolio_role:
        | "portfolio_company_admin"
        | "portfolio_team_editor"
        | "portfolio_team_viewer"
        | "supplier"
        | "stakeholder"
        | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_type: [
        "create",
        "update",
        "delete",
        "upload",
        "download",
        "view",
        "share",
        "restore",
      ],
      pending_status: ["pending", "approved", "rejected", "expired"],
      portfolio_role: [
        "portfolio_company_admin",
        "portfolio_team_editor",
        "portfolio_team_viewer",
        "supplier",
        "stakeholder",
        "super_admin",
      ],
    },
  },
} as const
