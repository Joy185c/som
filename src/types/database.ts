export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      sections: {
        Row: { id: string; name: string; slug: string; order_index: number; visible: boolean; created_at: string };
        Insert: { id?: string; name: string; slug: string; order_index?: number; visible?: boolean; created_at?: string };
        Update: { id?: string; name?: string; slug?: string; order_index?: number; visible?: boolean; created_at?: string };
      };
      works: {
        Row: {
          id: string; section_id: string | null; title: string; slug: string; description: string | null; video_url: string | null; thumbnail_url: string | null; project_type: string; tools: string[]; tags: string[]; is_vertical: boolean; view_count: number; published: boolean; order_index: number; created_at: string; updated_at: string;
        };
        Insert: { id?: string; section_id?: string | null; title: string; slug: string; description?: string | null; video_url?: string | null; thumbnail_url?: string | null; project_type: string; tools?: string[]; tags?: string[]; is_vertical?: boolean; view_count?: number; published?: boolean; order_index?: number; created_at?: string; updated_at?: string };
        Update: { id?: string; section_id?: string | null; title?: string; slug?: string; description?: string | null; video_url?: string | null; thumbnail_url?: string | null; project_type?: string; tools?: string[]; tags?: string[]; is_vertical?: boolean; view_count?: number; published?: boolean; order_index?: number; created_at?: string; updated_at?: string };
      };
      reviews: {
        Row: { id: string; client_name: string; client_photo_url: string | null; rating: number; content: string; project_type: string | null; video_url: string | null; approved: boolean; created_at: string };
        Insert: { id?: string; client_name: string; client_photo_url?: string | null; rating: number; content: string; project_type?: string | null; video_url?: string | null; approved?: boolean; created_at?: string };
        Update: { id?: string; client_name?: string; client_photo_url?: string | null; rating?: number; content?: string; project_type?: string | null; video_url?: string | null; approved?: boolean; created_at?: string };
      };
      team_members: {
        Row: { id: string; name: string; position: string; bio: string | null; photo_url: string | null; social_links: Json; published: boolean; order_index: number; created_at: string };
        Insert: { id?: string; name: string; position: string; bio?: string | null; photo_url?: string | null; social_links?: Json; published?: boolean; order_index?: number; created_at?: string };
        Update: { id?: string; name?: string; position?: string; bio?: string | null; photo_url?: string | null; social_links?: Json; published?: boolean; order_index?: number; created_at?: string };
      };
      meetings: {
        Row: { id: string; client_name: string; client_email: string; client_phone: string | null; project_type: string; budget_range: string | null; preferred_date: string | null; preferred_time_slot: string | null; message: string | null; brief_file_url: string | null; status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; created_at: string; updated_at: string };
        Insert: { id?: string; client_name: string; client_email: string; client_phone?: string | null; project_type: string; budget_range?: string | null; preferred_date?: string | null; preferred_time_slot?: string | null; message?: string | null; brief_file_url?: string | null; status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'; created_at?: string; updated_at?: string };
        Update: { id?: string; client_name?: string; client_email?: string; client_phone?: string | null; project_type?: string; budget_range?: string | null; preferred_date?: string | null; preferred_time_slot?: string | null; message?: string | null; brief_file_url?: string | null; status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'; created_at?: string; updated_at?: string };
      };
      site_settings: {
        Row: { id: string; key: string; value: Json; updated_at: string };
        Insert: { id?: string; key: string; value: Json; updated_at?: string };
        Update: { id?: string; key?: string; value?: Json; updated_at?: string };
      };
    };
  };
}

export type Section = Database['public']['Tables']['sections']['Row'];
export type Work = Database['public']['Tables']['works']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type Meeting = Database['public']['Tables']['meetings']['Row'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
