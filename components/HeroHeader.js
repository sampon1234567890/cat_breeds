import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CatDoodle from './CatDoodle';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function HeroHeader({ search, onChangeSearch }) {
  const insets = useSafeAreaInsets();
  const entrance = useSharedValue(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    entrance.set(withSpring(1, { damping: 15, stiffness: 100 }));
  }, [entrance]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: entrance.get(),
    transform: [
      {
        translateY: interpolate(entrance.get(), [0, 1], [-16, 0]),
      },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <LinearGradient
        colors={['#6C63FF', '#9B6DFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + 18 }]}
      >
        {/* Monochrome line-art cat doodles — placed cleanly in the corners.
            Opacity must stay clearly readable on the violet gradient:
            0.08–0.1 was invisible in Expo Go; research recommends ~0.3–0.5
            for white strokes over #6C63FF/#9B6DFF to read as decoration. */}
        <CatDoodle
          size={126}
          opacity={0.42}
          rotate="-8deg"
          style={{ position: 'absolute', right: -22, top: 0 }}
        />
        <CatDoodle
          size={64}
          opacity={0.36}
          rotate="12deg"
          style={{ position: 'absolute', right: 12, bottom: 2 }}
        />
        <CatDoodle
          size={46}
          opacity={0.38}
          rotate="-14deg"
          style={{ position: 'absolute', left: 16, bottom: 34 }}
        />

        <View style={styles.logoRow}>
          <MaterialCommunityIcons name="paw" size={28} color="#FFFFFF" />
          <Text style={styles.logo}>Meowpedia</Text>
        </View>
        <Text style={styles.tagline}>
          Your feline encyclopedia — meet the fluffiest breeds on the planet
        </Text>

        <View style={[styles.searchWrap, focused && styles.searchWrapFocused]}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#6C63FF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or origin…"
            placeholderTextColor="#A9A3C4"
            value={search}
            onChangeText={onChangeSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {search ? (
            <Pressable
              onPress={() => onChangeSearch('')}
              hitSlop={10}
              style={styles.clearBtn}
              accessibilityLabel="Clear search"
            >
              <MaterialCommunityIcons name="close" size={15} color="#6C63FF" />
            </Pressable>
          ) : null}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tagline: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    lineHeight: 20,
  },
  searchWrap: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    boxShadow: '0 8px 20px rgba(43,37,64,0.18)',
  },
  searchWrapFocused: {
    borderColor: '#FFFFFF',
    boxShadow: '0 10px 26px rgba(43,37,64,0.28)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2B2540',
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEFFF',
    marginLeft: 8,
  },
});