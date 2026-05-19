import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSightingsStore } from '@/store/sightings';

export default function LogScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const addSighting = useSightingsStore((s) => s.addSighting);

  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [count, setCount] = useState('1');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = species.trim().length > 0 && !saving;

  async function handleSave() {
    if (!canSave) return;

    const name = species.trim();
    setSaving(true);
    try {
      await addSighting({
        species: name,
        location: location.trim() || 'Unknown location',
        date: new Date().toISOString(),
        count: parseInt(count, 10) || 1,
        notes: notes.trim() || undefined,
      });

      setSpecies('');
      setLocation('');
      setCount('1');
      setNotes('');

      if (Platform.OS === 'web') {
        alert('Sighting saved!');
      } else {
        Alert.alert('Saved', `${name} added to your sightings.`);
      }
    } finally {
      setSaving(false);
    }
  }

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingBottom: insets.bottom + BottomTabInset + Spacing.three,
    },
    ios: {},
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={{ ...insets, bottom: insets.bottom + BottomTabInset + Spacing.three }}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Log Sighting</ThemedText>
          <ThemedText themeColor="textSecondary">Record a new bird observation</ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <ThemedText style={styles.label}>Species</ThemedText>
            <View style={[styles.inputRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <SymbolView
                tintColor={theme.textSecondary}
                name={{ ios: 'bird.fill', android: 'flutter_dash', web: 'flutter_dash' }}
                size={18}
              />
              <TextInput
                value={species}
                onChangeText={setSpecies}
                placeholder="e.g. Northern Cardinal"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text }]}
              />
            </View>
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Location</ThemedText>
            <View style={[styles.inputRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <SymbolView
                tintColor={theme.textSecondary}
                name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
                size={18}
              />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Where did you see it?"
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text }]}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <ThemedText style={styles.label}>Date</ThemedText>
              <View style={[styles.inputRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <SymbolView
                  tintColor={theme.textSecondary}
                  name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
                  size={18}
                />
                <ThemedText themeColor="textSecondary" style={styles.placeholderText}>Today</ThemedText>
              </View>
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <ThemedText style={styles.label}>Count</ThemedText>
              <View style={[styles.inputRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <SymbolView
                  tintColor={theme.textSecondary}
                  name={{ ios: 'number', android: 'tag', web: 'tag' }}
                  size={18}
                />
                <TextInput
                  value={count}
                  onChangeText={setCount}
                  placeholder="1"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  style={[styles.input, { color: theme.text }]}
                />
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Notes</ThemedText>
            <View style={[styles.textAreaContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Behavior, plumage, habitat..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={[styles.textArea, { color: theme.text }]}
              />
            </View>
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Photo</ThemedText>
            <Pressable>
              <View style={[styles.photoButton, { borderColor: theme.border }]}>
                <SymbolView
                  tintColor={theme.primary}
                  name={{ ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' }}
                  size={28}
                />
                <ThemedText type="small" themeColor="textSecondary">Tap to add a photo</ThemedText>
              </View>
            </Pressable>
          </View>

          <Pressable onPress={handleSave} disabled={!canSave}>
            <View style={[styles.submitButton, { backgroundColor: canSave ? theme.primary : theme.backgroundElement }]}>
              <ThemedText style={[styles.submitText, !canSave && { color: theme.textSecondary }]}>
                {saving ? 'Saving...' : 'Save Sighting'}
              </ThemedText>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
  },
  header: {
    paddingVertical: Spacing.five,
    gap: Spacing.one,
  },
  form: {
    gap: Spacing.four,
  },
  field: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  placeholderText: {
    fontSize: 15,
    paddingVertical: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  textAreaContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.three,
  },
  textArea: {
    fontSize: 15,
    minHeight: 80,
  },
  photoButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
