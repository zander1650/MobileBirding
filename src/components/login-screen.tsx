import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAuthStore } from "@/store/auth";

export function LoginScreen() {
  const theme = useTheme();
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    loading,
    error,
    clearError,
  } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    (!isSignUp || displayName.trim().length > 0);

  async function handleEmailAuth() {
    if (!canSubmit) return;
    setSubmitting(true);
    if (isSignUp) {
      await signUpWithEmail(email.trim(), password, displayName.trim());
    } else {
      await signInWithEmail(email.trim(), password);
    }
    setSubmitting(false);
  }

  function toggleMode() {
    setIsSignUp((prev) => !prev);
    clearError();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <SymbolView
            tintColor={theme.primary}
            name={{
              ios: "bird.fill",
              android: "flutter_dash",
              web: "flutter_dash",
            }}
            size={56}
          />
        </View>

        <ThemedText type="subtitle" style={styles.centered}>
          BirdLog
        </ThemedText>
        <ThemedText
          themeColor="textSecondary"
          style={[styles.centered, { marginBottom: Spacing.four }]}
        >
          {isSignUp ? "Create your account" : "Sign in to continue"}
        </ThemedText>

        {error && (
          <View
            style={[
              styles.errorBox,
              { backgroundColor: theme.accentLight, borderColor: theme.danger },
            ]}
          >
            <ThemedText style={{ color: theme.danger, fontSize: 14 }}>
              {error}
            </ThemedText>
          </View>
        )}

        {isSignUp && (
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <SymbolView
              tintColor={theme.textSecondary}
              name={{ ios: "person.fill", android: "person", web: "person" }}
              size={18}
            />
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Display name"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="words"
              style={[styles.input, { color: theme.text }]}
            />
          </View>
        )}

        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <SymbolView
            tintColor={theme.textSecondary}
            name={{ ios: "envelope.fill", android: "mail", web: "mail" }}
            size={18}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            style={[styles.input, { color: theme.text }]}
          />
        </View>

        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <SymbolView
            tintColor={theme.textSecondary}
            name={{ ios: "lock.fill", android: "lock", web: "lock" }}
            size={18}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
            textContentType={isSignUp ? "newPassword" : "password"}
            style={[styles.input, { color: theme.text }]}
          />
        </View>

        <Pressable
          onPress={handleEmailAuth}
          disabled={!canSubmit || submitting}
        >
          <View
            style={[
              styles.primaryButton,
              {
                backgroundColor:
                  canSubmit && !submitting
                    ? theme.primary
                    : theme.backgroundElement,
              },
            ]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText
                style={[
                  styles.primaryButtonText,
                  (!canSubmit || submitting) && { color: theme.textSecondary },
                ]}
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </ThemedText>
            )}
          </View>
        </Pressable>

        <View style={styles.dividerRow}>
          <View
            style={[styles.dividerLine, { backgroundColor: theme.border }]}
          />
          <ThemedText type="small" themeColor="textSecondary">
            or
          </ThemedText>
          <View
            style={[styles.dividerLine, { backgroundColor: theme.border }]}
          />
        </View>

        <Pressable
          onPress={signInWithGoogle}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <View
            style={[
              styles.googleButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <ThemedText style={styles.googleButtonText}>
              Continue with Google
            </ThemedText>
          </View>
        </Pressable>

        <Pressable onPress={toggleMode} style={styles.toggleRow}>
          <ThemedText type="small" themeColor="textSecondary">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
          </ThemedText>
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: Spacing.five,
    gap: Spacing.three,
  },
  centered: {
    textAlign: "center",
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: Spacing.two,
  },
  errorBox: {
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.one,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.one,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    borderRadius: 12,
    borderWidth: 1,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
