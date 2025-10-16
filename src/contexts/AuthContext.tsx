/**
 * ═══════════════════════════════════════════════════════════════════
 * 🔐 AUTHENTICATION CONTEXT
 * Хэрэглэгчийн нэвтрэлт, эрх зэрэг мэдээллийг удирдах
 * ═══════════════════════════════════════════════════════════════════
 */

import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// ═══════════════════════════════════════════════════════════════════
// TYPES - Төрлүүд
// ═══════════════════════════════════════════════════════════════════

interface AuthContextType {
  user: User | null;              // Нэвтэрсэн хэрэглэгч
  session: Session | null;        // Session мэдээлэл
  userRole: 'admin' | 'member' | 'user' | null;  // Хэрэглэгчийн эрх
  loading: boolean;               // Ачааллаж байгаа эсэх
  signIn: (email: string, password: string) => Promise<void>;   // Нэвтрэх
  signUp: (email: string, password: string) => Promise<void>;   // Бүртгүүлэх
  signOut: () => Promise<void>;   // Гарах
}

// Context үүсгэх
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

// ═══════════════════════════════════════════════════════════════════
// AUTH PROVIDER - Нэвтрэлтийн мэдээлэл өгөгч
// ═══════════════════════════════════════════════════════════════════

export function AuthProvider({ children }: { children: ReactNode }) {
  // State хувьсагчууд
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'member' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  // ═══════════════════════════════════════════════════════════════════
  // EFFECT - Анхны ачаалал болон auth өөрчлөлт сонсох
  // ═══════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    // Идэвхтэй session шалгах
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Auth өөрчлөлт сонсох (login, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    // Component устахад subscription цуцлах
    return () => subscription.unsubscribe();
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // FETCH USER ROLE - Хэрэглэгчийн эрх татах
  // ═══════════════════════════════════════════════════════════════════
  
  const fetchUserRole = async (userId: string) => {
    try {
      console.log('🔍 Хэрэглэгчийн эрх татаж байна:', userId);
      
      // RPC функц ашиглан эрх авах (infinite recursion-ээс зайлсхийх)
      const { data, error } = await supabase.rpc('get_user_role', {
        user_id: userId
      });

      if (error) {
        console.warn('⚠️ RPC алдаа (fallback ашиглаж байна):', error.message);
        
        // Fallback: Шууд query хийх (RLS унтраасан учраас ажиллана)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .maybeSingle();
        
        if (userError) {
          console.error('❌ Direct query алдаа:', userError);
          setUserRole('user'); // Default эрх
        } else {
          console.log('✅ Эрх (direct query):', userData?.role);
          setUserRole(userData?.role || 'user');
        }
      } else {
        console.log('✅ Эрх (RPC):', data);
        setUserRole(data || 'user');
      }
    } catch (error) {
      console.error('❌ Эрх татахад алдаа:', error);
      setUserRole('user'); // Алдаа гарвал default эрх
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // AUTH FUNCTIONS - Нэвтрэлтийн функцүүд
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Нэвтрэх
   * @param email - Имэйл хаяг
   * @param password - Нууц үг
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  /**
   * Бүртгүүлэх
   * @param email - Имэйл хаяг
   * @param password - Нууц үг
   */
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    // Users table дээр мэдээлэл үүсгэх (trigger автоматаар хийнэ)
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        role: 'user', // Default эрх
      });
    }
  };

  /**
   * Гарах
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
