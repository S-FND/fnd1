export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
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
      approval_history: {
        Row: {
          action: string
          actor_id: string
          actor_role: string
          approval_request_id: string
          comment: string | null
          created_at: string
          data_snapshot: Json | null
          id: string
          ip_address: unknown | null
          new_status: Database["public"]["Enums"]["workflow_status"]
          previous_status: Database["public"]["Enums"]["workflow_status"] | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id: string
          actor_role: string
          approval_request_id: string
          comment?: string | null
          created_at?: string
          data_snapshot?: Json | null
          id?: string
          ip_address?: unknown | null
          new_status: Database["public"]["Enums"]["workflow_status"]
          previous_status?:
            | Database["public"]["Enums"]["workflow_status"]
            | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          actor_role?: string
          approval_request_id?: string
          comment?: string | null
          created_at?: string
          data_snapshot?: Json | null
          id?: string
          ip_address?: unknown | null
          new_status?: Database["public"]["Enums"]["workflow_status"]
          previous_status?:
            | Database["public"]["Enums"]["workflow_status"]
            | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_history_approval_request_id_fkey"
            columns: ["approval_request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          approved_at: string | null
          approver_id: string | null
          assigned_checker_id: string | null
          change_summary: string | null
          created_at: string
          current_data: Json
          due_at: string | null
          evidence_urls: string[] | null
          id: string
          maker_id: string
          materiality_flag: boolean | null
          module: Database["public"]["Enums"]["maker_checker_module"]
          portfolio_company_id: string | null
          previous_data: Json | null
          priority: Database["public"]["Enums"]["approval_priority"]
          record_id: string
          record_type: string
          requires_dual_approval: boolean | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["workflow_status"]
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approver_id?: string | null
          assigned_checker_id?: string | null
          change_summary?: string | null
          created_at?: string
          current_data: Json
          due_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          maker_id: string
          materiality_flag?: boolean | null
          module: Database["public"]["Enums"]["maker_checker_module"]
          portfolio_company_id?: string | null
          previous_data?: Json | null
          priority?: Database["public"]["Enums"]["approval_priority"]
          record_id: string
          record_type: string
          requires_dual_approval?: boolean | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approver_id?: string | null
          assigned_checker_id?: string | null
          change_summary?: string | null
          created_at?: string
          current_data?: Json
          due_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          maker_id?: string
          materiality_flag?: boolean | null
          module?: Database["public"]["Enums"]["maker_checker_module"]
          portfolio_company_id?: string | null
          previous_data?: Json | null
          priority?: Database["public"]["Enums"]["approval_priority"]
          record_id?: string
          record_type?: string
          requires_dual_approval?: boolean | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_portfolio_company_id_fkey"
            columns: ["portfolio_company_id"]
            isOneToOne: false
            referencedRelation: "portfolio_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_sla_config: {
        Row: {
          created_at: string
          escalation_enabled: boolean | null
          escalation_hours: number | null
          id: string
          module: Database["public"]["Enums"]["maker_checker_module"]
          requires_dual_approval: boolean | null
          sla_hours: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          escalation_enabled?: boolean | null
          escalation_hours?: number | null
          id?: string
          module: Database["public"]["Enums"]["maker_checker_module"]
          requires_dual_approval?: boolean | null
          sla_hours: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          escalation_enabled?: boolean | null
          escalation_hours?: number | null
          id?: string
          module?: Database["public"]["Enums"]["maker_checker_module"]
          requires_dual_approval?: boolean | null
          sla_hours?: number
          updated_at?: string
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
      brsr_report_versions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          change_summary: string | null
          content: Json
          created_at: string
          created_by: string
          evidence_urls: string[] | null
          id: string
          is_current: boolean | null
          metrics_references: string[] | null
          portfolio_company_id: string | null
          report_section_id: string
          review_notes: string | null
          section_name: string
          section_type: string
          version_number: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          change_summary?: string | null
          content: Json
          created_at?: string
          created_by: string
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          metrics_references?: string[] | null
          portfolio_company_id?: string | null
          report_section_id: string
          review_notes?: string | null
          section_name: string
          section_type: string
          version_number: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          change_summary?: string | null
          content?: Json
          created_at?: string
          created_by?: string
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          metrics_references?: string[] | null
          portfolio_company_id?: string | null
          report_section_id?: string
          review_notes?: string | null
          section_name?: string
          section_type?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "brsr_report_versions_portfolio_company_id_fkey"
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
      esg_cap_versions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cap_id: string
          change_summary: string | null
          completion_notes: string | null
          corrective_action: string
          created_at: string
          created_by: string
          evidence_urls: string[] | null
          id: string
          is_current: boolean | null
          issue_description: string
          portfolio_company_id: string | null
          responsible_person: string | null
          status: string
          target_date: string | null
          version_number: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cap_id: string
          change_summary?: string | null
          completion_notes?: string | null
          corrective_action: string
          created_at?: string
          created_by: string
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          issue_description: string
          portfolio_company_id?: string | null
          responsible_person?: string | null
          status: string
          target_date?: string | null
          version_number: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cap_id?: string
          change_summary?: string | null
          completion_notes?: string | null
          corrective_action?: string
          created_at?: string
          created_by?: string
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          issue_description?: string
          portfolio_company_id?: string | null
          responsible_person?: string | null
          status?: string
          target_date?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "esg_cap_versions_portfolio_company_id_fkey"
            columns: ["portfolio_company_id"]
            isOneToOne: false
            referencedRelation: "portfolio_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_dd_versions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assessment_notes: string | null
          change_summary: string | null
          created_at: string
          created_by: string
          dd_record_id: string
          evidence_urls: string[] | null
          id: string
          is_current: boolean | null
          portfolio_company_id: string | null
          questionnaire_data: Json
          responses: Json
          risk_score: number | null
          version_number: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          assessment_notes?: string | null
          change_summary?: string | null
          created_at?: string
          created_by: string
          dd_record_id: string
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          portfolio_company_id?: string | null
          questionnaire_data: Json
          responses: Json
          risk_score?: number | null
          version_number: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          assessment_notes?: string | null
          change_summary?: string | null
          created_at?: string
          created_by?: string
          dd_record_id?: string
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          portfolio_company_id?: string | null
          questionnaire_data?: Json
          responses?: Json
          risk_score?: number | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "esg_dd_versions_portfolio_company_id_fkey"
            columns: ["portfolio_company_id"]
            isOneToOne: false
            referencedRelation: "portfolio_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_metrics_versions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          calculation_method: string | null
          change_reason: string | null
          change_summary: string | null
          created_at: string
          created_by: string
          data_source: string | null
          evidence_urls: string[] | null
          id: string
          is_current: boolean | null
          metric_id: string
          metric_name: string
          metric_value: number | null
          portfolio_company_id: string | null
          reporting_period: string | null
          unit: string | null
          version_number: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          calculation_method?: string | null
          change_reason?: string | null
          change_summary?: string | null
          created_at?: string
          created_by: string
          data_source?: string | null
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          metric_id: string
          metric_name: string
          metric_value?: number | null
          portfolio_company_id?: string | null
          reporting_period?: string | null
          unit?: string | null
          version_number: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          calculation_method?: string | null
          change_reason?: string | null
          change_summary?: string | null
          created_at?: string
          created_by?: string
          data_source?: string | null
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          metric_id?: string
          metric_name?: string
          metric_value?: number | null
          portfolio_company_id?: string | null
          reporting_period?: string | null
          unit?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "esg_metrics_versions_portfolio_company_id_fkey"
            columns: ["portfolio_company_id"]
            isOneToOne: false
            referencedRelation: "portfolio_companies"
            referencedColumns: ["id"]
          },
        ]
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
      ghg_accounting_versions: {
        Row: {
          activity_data: number
          activity_type: string
          activity_unit: string
          approved_at: string | null
          approved_by: string | null
          calculated_emissions: number
          calculation_formula: string | null
          change_summary: string | null
          created_at: string
          created_by: string
          emission_factor: number
          emission_factor_source: string
          emission_factor_version: string | null
          evidence_urls: string[] | null
          id: string
          is_current: boolean | null
          portfolio_company_id: string | null
          record_id: string
          reporting_period: string
          scope: string
          verification_notes: string | null
          version_number: number
        }
        Insert: {
          activity_data: number
          activity_type: string
          activity_unit: string
          approved_at?: string | null
          approved_by?: string | null
          calculated_emissions: number
          calculation_formula?: string | null
          change_summary?: string | null
          created_at?: string
          created_by: string
          emission_factor: number
          emission_factor_source: string
          emission_factor_version?: string | null
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          portfolio_company_id?: string | null
          record_id: string
          reporting_period: string
          scope: string
          verification_notes?: string | null
          version_number: number
        }
        Update: {
          activity_data?: number
          activity_type?: string
          activity_unit?: string
          approved_at?: string | null
          approved_by?: string | null
          calculated_emissions?: number
          calculation_formula?: string | null
          change_summary?: string | null
          created_at?: string
          created_by?: string
          emission_factor?: number
          emission_factor_source?: string
          emission_factor_version?: string | null
          evidence_urls?: string[] | null
          id?: string
          is_current?: boolean | null
          portfolio_company_id?: string | null
          record_id?: string
          reporting_period?: string
          scope?: string
          verification_notes?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "ghg_accounting_versions_portfolio_company_id_fkey"
            columns: ["portfolio_company_id"]
            isOneToOne: false
            referencedRelation: "portfolio_companies"
            referencedColumns: ["id"]
          },
        ]
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
          access_notes: string | null
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          is_approved: boolean
          name: string
          rejection_reason: string | null
          settings: Json | null
          slug: string
          updated_at: string
        }
        Insert: {
          access_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          name: string
          rejection_reason?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string
        }
        Update: {
          access_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          name?: string
          rejection_reason?: string | null
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
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_menu_permissions: {
        Row: {
          created_at: string
          created_by: string | null
          granted: boolean
          id: string
          menu_item_id: string
          portfolio_company_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          granted?: boolean
          id?: string
          menu_item_id: string
          portfolio_company_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          granted?: boolean
          id?: string
          menu_item_id?: string
          portfolio_company_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_menu_permissions_portfolio_company"
            columns: ["portfolio_company_id"]
            isOneToOne: false
            referencedRelation: "portfolio_companies"
            referencedColumns: ["id"]
          },
        ]
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
      create_approval_request: {
        Args: {
          p_change_summary?: string
          p_current_data: Json
          p_materiality_flag?: boolean
          p_module: Database["public"]["Enums"]["maker_checker_module"]
          p_previous_data?: Json
          p_priority?: Database["public"]["Enums"]["approval_priority"]
          p_record_id: string
          p_record_type: string
        }
        Returns: string
      }
      create_document_version: {
        Args: {
          p_change_summary?: string
          p_content?: string
          p_document_id: string
          p_file_size?: number
          p_file_url?: string
          p_mime_type?: string
          p_title: string
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
          p_description?: string
          p_entity_id?: string
          p_entity_name?: string
          p_entity_type: string
          p_metadata?: Json
        }
        Returns: string
      }
      process_approval_request: {
        Args: { p_action: string; p_comment?: string; p_request_id: string }
        Returns: boolean
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
      approval_priority: "low" | "medium" | "high" | "critical"
      maker_checker_module:
        | "esg_metrics"
        | "esg_cap"
        | "ghg_accounting"
        | "brsr_report"
        | "esg_dd"
      pending_status: "pending" | "approved" | "rejected" | "expired"
      portfolio_role:
        | "portfolio_company_admin"
        | "portfolio_team_editor"
        | "portfolio_team_viewer"
        | "supplier"
        | "stakeholder"
        | "super_admin"
      workflow_status:
        | "draft"
        | "pending_review"
        | "in_review"
        | "approved"
        | "published"
        | "rejected"
        | "revision_requested"
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
      approval_priority: ["low", "medium", "high", "critical"],
      maker_checker_module: [
        "esg_metrics",
        "esg_cap",
        "ghg_accounting",
        "brsr_report",
        "esg_dd",
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
      workflow_status: [
        "draft",
        "pending_review",
        "in_review",
        "approved",
        "published",
        "rejected",
        "revision_requested",
      ],
    },
  },
} as const
