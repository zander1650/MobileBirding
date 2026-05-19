import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSightingsStore } from '@/store/sightings';

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

function SightingCard({ species, location, date, notes, count }: {
  species: string;
  location: string;
  date: string;
  notes?: string;
  count: number;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.birdName}>{species}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">{formatRelativeTime(date)}</ThemedText>
      </View>
      <View style={styles.locationRow}>
        <SymbolView
          tintColor={theme.primary}
          name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
          size={14}
        />
        <ThemedText type="small" themeColor="textSecondary">{location}</ThemedText>
        {count > 1 && (
          <ThemedText type="small" themeColor="textSecondary"> x{count}</ThemedText>
        )}
      </View>
      {notes ? (
        <ThemedText type="small" style={{ marginTop: Spacing.one }}>{notes}</ThemedText>
      ) : null}
    </View>
  );
}

function EmptyState() {
  const theme = useTheme();

  return (
    <View style={[styles.emptyState, { borderColor: theme.border }]}>
      <SymbolView
        tintColor={theme.textSecondary}
        name={{ ios: 'bird.fill', android: 'flutter_dash', web: 'flutter_dash' }}
        size={40}
      />
      <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>
        No sightings yet.{'\n'}Head to the Log tab to record your first bird!
      </ThemedText>
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sightings = useSightingsStore((s) => s.sightings);
  const fetchSightings = useSightingsStore((s) => s.fetchSightings);

  useEffect(() => { fetchSightings(); }, [fetchSightings]);

  const uniqueSpecies = new Set(sightings.map((s) => s.species.toLowerCase())).size;
  const totalSightings = sightings.length;
  const uniqueLocations = new Set(sightings.map((s) => s.location.toLowerCase())).size;

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
          <ThemedText type="subtitle">Good morning</ThemedText>
          <ThemedText themeColor="textSecondary">Your recent birding activity</ThemedText>
        </View>

        <View style={[styles.statsRow, { borderColor: theme.border }]}>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: theme.primary }]}>{uniqueSpecies}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Species</ThemedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: theme.primary }]}>{totalSightings}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Sightings</ThemedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: theme.primary }]}>{uniqueLocations}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Locations</ThemedText>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Sightings</ThemedText>
        </View>

        {sightings.length === 0 ? (
          <EmptyState />
        ) : (
          sightings.map((sighting) => (
            <SightingCard key={sighting.id} {...sighting} />
          ))
        )}
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
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: Spacing.four,
    marginBottom: Spacing.four,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
  },
  sectionHeader: {
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  birdName: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  emptyState: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
});
