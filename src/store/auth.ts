import { create } from 'zustand';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

import { auth } from '@/config/firebase';
import { supabase } from '@/config/supabase';

type AuthState = {
  user: User | null;
  profileId: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

async function ensureProfile(user: User): Promise<string> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('firebase_uid', user.uid)
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from('profiles')
    .insert({
      firebase_uid: user.uid,
      email: user.email,
      display_name: user.displayName,
      avatar_url: user.photoURL,
    })
    .select('id')
    .single();

  if (error) throw error;
  return created!.id;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profileId: null,
  loading: true,

  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null, profileId: null });
  },
}));

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const profileId = await ensureProfile(user);
    useAuthStore.setState({ user, profileId, loading: false });
  } else {
    useAuthStore.setState({ user: null, profileId: null, loading: false });
  }
});
