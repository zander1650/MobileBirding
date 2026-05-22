import { create } from 'zustand';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { auth } from '@/config/firebase';
import { supabase } from '@/config/supabase';

WebBrowser.maybeCompleteAuthSession();

// TODO: Replace with your Web Client ID from Firebase Console
// Firebase Console > Authentication > Sign-in method > Google > Web SDK configuration > Web client ID
const GOOGLE_WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

type AuthState = {
  user: User | null;
  profileId: string | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
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

function friendlyError(code: string): string {
  switch (code) {
    case 'auth/invalid-email': return 'Invalid email address.';
    case 'auth/user-disabled': return 'This account has been disabled.';
    case 'auth/user-not-found': return 'No account found with this email.';
    case 'auth/wrong-password': return 'Incorrect password.';
    case 'auth/invalid-credential': return 'Incorrect email or password.';
    case 'auth/email-already-in-use': return 'An account with this email already exists.';
    case 'auth/weak-password': return 'Password must be at least 6 characters.';
    default: return 'Something went wrong. Please try again.';
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profileId: null,
  loading: true,
  error: null,

  clearError: () => set({ error: null }),

  signInWithGoogle: async () => {
    set({ error: null });
    try {
      const redirectUri = AuthSession.makeRedirectUri();

      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_WEB_CLIENT_ID,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.IdToken,
        extraParams: { nonce: Math.random().toString(36).substring(2) },
      });

      const result = await request.promptAsync(discovery);

      if (result.type === 'success' && result.params.id_token) {
        const credential = GoogleAuthProvider.credential(result.params.id_token);
        await signInWithCredential(auth, credential);
      }
    } catch (e: any) {
      set({ error: friendlyError(e.code) });
    }
  },

  signInWithEmail: async (email, password) => {
    set({ error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      set({ error: friendlyError(e.code) });
    }
  },

  signUpWithEmail: async (email, password, displayName) => {
    set({ error: null });
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
    } catch (e: any) {
      set({ error: friendlyError(e.code) });
    }
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
