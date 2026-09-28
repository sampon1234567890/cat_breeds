import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OPTIONS = [
  { key: 'all', icon: '✨', label: 'All' },
  { key: 'popular', icon: '🔥', label: 'Popular' },
  { key: 'searched', icon: 'magnify', label: 'Searched' },
  { key: 'newest', icon: 'new-box', label: 'Newest' },
  { key: 'az', icon: 'sort-alphabetical-ascending', label: 'A–Z' },
  { key: 'za', icon: 'sort-alphabetical-descending', label: 'Z–A' },
];

export default function FilterBar({ count, sort, onChangeSort }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.countPill}>
          <MaterialCommunityIcons
            name="cat"
            size={15}
            color="#4F46DB"
            style={styles.countPillIcon}
          />
          <Text style={styles.countNumber}>{count}</Text>
          <Text style={styles.countLabel}>{count === 1 ? 'breed' : 'breeds'}</Text>
        </View>
        <View style={styles.sortHint}>
          <Text style={styles.sortHintText}>Sort & filter</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {OPTIONS.map((opt) => {
          const active = sort === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => onChangeSort(opt.key)}
              accessibilityRole="button"
              style={[styles.chip, active && styles.chipActive]}
            >
              {typeof opt.icon === 'string' && Array.from(opt.icon).length === 1 ? (
                <Text style={styles.chipEmoji}>{opt.icon}</Text>
              ) : (
                <MaterialCommunityIcons
                  name={opt.icon}
                  size={15}
                  color={active ? '#FFFFFF' : '#4F46DB'}
                  style={styles.chipIcon}
                />
              )}
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E6E0F7',
    boxShadow: '0 10px 28px rgba(99,102,241,0.12)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9E9FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4F46DB',
    lineHeight: 17,
  },
  countLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C6AB0',
    lineHeight: 17,
    marginLeft: 3,
  },
  countPillIcon: {
    marginRight: 6,
  },
  sortHint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A49FE0',
  },
  chipsRow: {
    gap: 8,
    paddingHorizontal: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F0FF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: '#6C63FF',
    boxShadow: '0 6px 16px rgba(108,99,255,0.35)',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipEmoji: {
    fontSize: 12,
    lineHeight: 15,
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46DB',
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },
});