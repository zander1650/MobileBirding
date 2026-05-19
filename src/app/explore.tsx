import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FEATURED_BIRDS = [
  { id: '1', name: 'Bald Eagle', family: 'Accipitridae', status: 'Least Concern' },
  { id: '2', name: 'Snowy Owl', family: 'Strigidae', status: 'Vulnerable' },
  { id: '3', name: 'Pileated Woodpecker', family: 'Picidae', status: 'Least Concern' },
  { id: '4', name: 'Painted Bunting', family: 'Cardinalidae', status: 'Near Threatened' },
  { id: '5', name: 'Atlantic Puffin', family: 'Alcidae', status: 'Vulnerable' },
  { id: '6', name: 'Peregrine Falcon', family: 'Falconidae', status: 'Least Concern' },
];

const CATEGORIES = [
  { label: 'Raptors', icon: { ios: 'wind' as const, android: 'airplanemode_active' as const, web: 'airplanemode_active' as const } },
  { label: 'Songbirds', icon: { ios: 'music.note' as const, android: 'music_note' as const, web: 'music_note' as const } },
  { label: 'Waterfowl', icon: { ios: 'drop.fill' as const, android: 'water_drop' as const, web: 'water_drop' as const } },
  { label: 'Shorebirds', icon: { ios: 'beach.umbrella' as const, android: 'beach_access' as const, web: 'beach_access' as const } },
];

function StatusBadge({ status }: { status: string }) {
  const theme = useTheme();
  const isVulnerable = status === 'Vulnerable' || status === 'Near Threatened';

  return (
    <View style={[styles.badge, { backgroundColor: isVulnerable ? theme.accentLight : theme.backgroundElement }]}>
      <ThemedText
        type="small"
        style={{ fontSize: 11, color: isVulnerable ? theme.accent : theme.textSecondary }}>
        {status}
      </ThemedText>
    </View>
  );
}

export default function ExploreScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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
          <ThemedText type="subtitle">Explore</ThemedText>
          <ThemedText themeColor="textSecondary">Discover birds in your area</ThemedText>
        </View>

        <View style={[styles.searchBar, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <SymbolView
            tintColor={theme.textSecondary}
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={18}
          />
          <TextInput
            placeholder="Search birds, locations..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {CATEGORIES.map((cat) => (
            <Pressable key={cat.label}>
              <View style={[styles.categoryChip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <SymbolView tintColor={theme.primary} name={cat.icon} size={16} />
                <ThemedText type="small">{cat.label}</ThemedText>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Featured Species</ThemedText>
        </View>

        {FEATURED_BIRDS.map((bird) => (
          <Pressable key={bird.id}>
            <View style={[styles.birdRow, { borderColor: theme.border }]}>
              <View style={[styles.birdIcon, { backgroundColor: theme.backgroundElement }]}>
                <SymbolView
                  tintColor={theme.primary}
                  name={{ ios: 'bird.fill', android: 'flutter_dash', web: 'flutter_dash' }}
                  size={22}
                />
              </View>
              <View style={styles.birdInfo}>
                <ThemedText style={styles.birdName}>{bird.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{bird.family}</ThemedText>
              </View>
              <StatusBadge status={bird.status} />
            </View>
          </Pressable>
        ))}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.one,
  },
  categoriesScroll: {
    marginBottom: Spacing.four,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: Spacing.two,
  },
  sectionHeader: {
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  birdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  birdIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
