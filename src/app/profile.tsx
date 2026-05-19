import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth';
import { useSightingsStore } from '@/store/sightings';

type LifeListEntry = {
  species: string;
  firstSeen: string;
  count: number;
};

function buildLifeList(sightings: { species: string; date: string; count: number }[]): LifeListEntry[] {
  const map = new Map<string, LifeListEntry>();

  for (const s of sightings) {
    const key = s.species.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.count += s.count;
      if (s.date < existing.firstSeen) {
        existing.firstSeen = s.date;
      }
    } else {
      map.set(key, { species: s.species, firstSeen: s.date, count: s.count });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.firstSeen.localeCompare(a.firstSeen));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuthStore();
  const sightings = useSightingsStore((s) => s.sightings);

  const lifeList = buildLifeList(sightings);
  const totalLogs = sightings.length;

  const now = new Date();
  const thisMonthCount = sightings.filter((s) => {
    const d = new Date(s.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

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
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}>
            <SymbolView
              tintColor={theme.primary}
              name={{ ios: 'person.crop.circle.fill', android: 'account_circle', web: 'account_circle' }}
              size={48}
            />
          </View>
          <ThemedText type="subtitle">{user?.displayName ?? 'Birder'}</ThemedText>
          <ThemedText themeColor="textSecondary">{user?.email ?? 'Your birding profile'}</ThemedText>
        </View>

        <View style={[styles.statsRow, { borderColor: theme.border }]}>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: theme.primary }]}>{lifeList.length}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Life List</ThemedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: theme.primary }]}>{totalLogs}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Total Logs</ThemedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: theme.primary }]}>{thisMonthCount}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">This Month</ThemedText>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Life List</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {lifeList.length} species
          </ThemedText>
        </View>

        {lifeList.length === 0 ? (
          <View style={[styles.emptyState, { borderColor: theme.border }]}>
            <SymbolView
              tintColor={theme.textSecondary}
              name={{ ios: 'list.bullet', android: 'list', web: 'list' }}
              size={32}
            />
            <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>
              Your life list is empty.{'\n'}Log sightings to start building it!
            </ThemedText>
          </View>
        ) : (
          lifeList.map((bird) => (
            <Pressable key={bird.species}>
              <View style={[styles.lifeListRow, { borderColor: theme.border }]}>
                <View style={[styles.birdIcon, { backgroundColor: theme.backgroundElement }]}>
                  <SymbolView
                    tintColor={theme.primary}
                    name={{ ios: 'bird.fill', android: 'flutter_dash', web: 'flutter_dash' }}
                    size={18}
                  />
                </View>
                <View style={styles.birdInfo}>
                  <ThemedText style={styles.birdName}>{bird.species}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    First seen {formatDate(bird.firstSeen)}
                  </ThemedText>
                </View>
                <View style={[styles.countBadge, { backgroundColor: theme.backgroundElement }]}>
                  <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>
                    x{bird.count}
                  </ThemedText>
                </View>
              </View>
            </Pressable>
          ))
        )}

        <Pressable onPress={signOut} style={{ marginTop: Spacing.five, marginBottom: Spacing.five }}>
          <View style={[styles.signOutButton, { borderColor: theme.danger }]}>
            <ThemedText style={{ color: theme.danger, fontSize: 16, fontWeight: '600' }}>
              Sign Out
            </ThemedText>
          </View>
        </Pressable>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    gap: Spacing.one,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: Spacing.four,
    marginBottom: Spacing.five,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  lifeListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  birdIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  birdInfo: {
    flex: 1,
    gap: 2,
  },
  birdName: {
    fontSize: 15,
    fontWeight: '600',
  },
  countBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 8,
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
  signOutButton: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
