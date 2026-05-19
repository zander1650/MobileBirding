import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth';

export function LoginScreen() {
  const theme = useTheme();
  const { signInWithGoogle, loading } = useAuthStore();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: theme.backgroundElement }]}>
          <SymbolView
            tintColor={theme.primary}
            name={{ ios: 'bird.fill', android: 'flutter_dash', web: 'flutter_dash' }}
            size={56}
          />
        </View>

        <ThemedText type="subtitle" style={styles.title}>BirdLog</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          Track your birding adventures
        </ThemedText>

        <Pressable onPress={signInWithGoogle} style={({ pressed }) => pressed && styles.pressed}>
          <View style={[styles.googleButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText style={styles.googleButtonText}>Sign in with Google</ThemedText>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.three,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.two,
    minWidth: 260,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
