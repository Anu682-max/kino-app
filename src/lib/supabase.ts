import { createClient } from '@supabase/supabase-js';

// Supabase URL болон Anon key-г энд оруулна уу
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'member' | 'user';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'admin' | 'member' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'member' | 'user';
          created_at?: string;
        };
      };
      movies: {
        Row: {
          id: string;
          title: string;
          description: string;
          video_url: string;
          thumbnail_url: string;
          is_locked: boolean;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          video_url: string;
          thumbnail_url: string;
          is_locked?: boolean;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          video_url?: string;
          thumbnail_url?: string;
          is_locked?: boolean;
          created_at?: string;
          created_by?: string;
        };
      };
    };
  };
}
