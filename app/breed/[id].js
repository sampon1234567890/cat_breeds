import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { getBreed } from '../../api/breedApi';
import useRubberBand from '../../hooks/useRubberBand';
import CatDoodle from '../../components/CatDoodle';
import PressableScale from '../../components/PressableScale';
import { useFavorites } from '../../context/FavoritesContext';

export default function BreedDetailScreen() {
  const { id } = useLocalSearchParams();
  const { push } = useRouter();
  const breedId = Array.isArray(id) ? id[0] : id;
  const bounce = useRubberBand();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getBreed(breedId);
        setBreed(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [breedId]);

  const goHome = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (notFound || !breed) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="paw" size={64} color="#CDC9F4" />
        <Text style={styles.notFoundText}>Breed not found.</Text>
        <PressableScale onPress={goHome} activeScale={0.97} style={styles.backWrap}>
          <LinearGradient colors={['#6C63FF', '#8B5CF6']} style={styles.backBtn}>
            <Text style={styles.backText}>Go Back</Text>
          </LinearGradient>
        </PressableScale>
      </View>
    );
  }

  const showImage = !!breed.image_url && !imageFailed;
  const favorited = isFavorite(breedId);

  const stats = [];
  if (breed.lifespan) {
    stats.push({ icon: 'timer-sand', label: 'Lifespan', value: breed.lifespan });
  }
  const popularity = parseInt(breed.popularity, 10);
  if (!Number.isNaN(popularity) && popularity > 0) {
    stats.push({
      icon: 'fire',
      label: 'Popularity',
      value: popularity > 1000 ? `${(popularity / 1000).toFixed(1)}k` : String(popularity),
    });
  }
  const searches = parseInt(breed.search_count, 10);
  if (!Number.isNaN(searches) && searches > 0) {
    stats.push({
      icon: 'eye-outline',
      label: 'Searches',
      value: searches > 1000 ? `${(searches / 1000).toFixed(1)}k` : String(searches),
    });
  }

  return (
    <Animated.View style={[styles.screen, bounce.animatedStyle]}>
      <ScrollView
        style={styles.container}
        {...bounce.scrollProps}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — photo (or gradient placeholder) with name + origin overlay */}
        <View style={styles.hero}>
          {showImage ? (
            <>
              <Image
                source={{ uri: breed.image_url }}
                style={styles.heroImage}
                contentFit="cover"
                transition={250}
                onError={() => setImageFailed(true)}
              />
              <LinearGradient
                colors={['rgba(43,37,64,0)', 'rgba(43,37,64,0.55)']}
                style={styles.heroFade}
              />
            </>
          ) : (
            <LinearGradient
              colors={['#6C63FF', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.heroImage, styles.heroPlaceholder]}
            >
              <CatDoodle
                size={130}
                opacity={0.15}
                rotate="-6deg"
                style={{ position: 'absolute', right: -8, bottom: -10 }}
              />
              <View style={styles.placeholderIcon}>
                <MaterialCommunityIcons name="cat" size={44} color="#FFFFFF" />
              </View>
            </LinearGradient>
          )}

          {/* Floating edit action */}
          <PressableScale
            style={styles.heroAction}
            activeScale={0.88}
            onPress={() => push(`/edit/${breedId}`)}
            accessibilityLabel={`Edit ${breed.name}`}
          >
            <View style={styles.heroActionCircle}>
              <MaterialCommunityIcons name="pencil" size={20} color="#4F46DB" />
            </View>
          </PressableScale>

          {/* Name + origin pinned to the bottom of the hero */}
          <LinearGradient
            colors={['rgba(43,37,64,0)', 'rgba(28,22,48,0.72)']}
            style={styles.heroTitleFade}
          >
            <Text style={styles.name}>{breed.name}</Text>
            {breed.origin ? (
              <View style={styles.originPill}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={13}
                  color="#FFFFFF"
                />
                <Text style={styles.originText}>{breed.origin}</Text>
              </View>
            ) : null}
          </LinearGradient>
        </View>

        {/* Facts stat cards */}
        {stats.length > 0 ? (
          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <MaterialCommunityIcons
                    name={stat.icon}
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={styles.statValue} numberOfLines={2}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* About section card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <MaterialCommunityIcons
                name="text-box-outline"
                size={16}
                color="#FFFFFF"
              />
            </View>
            <Text style={styles.sectionTitle}>About this breed</Text>
          </View>

          {breed.temperament ? (
            <View style={styles.tempRow}>
              <MaterialCommunityIcons
                name="emoticon-happy-outline"
                size={17}
                color="#6C63FF"
              />
              <Text style={styles.tempText}>{breed.temperament}</Text>
            </View>
          ) : null}

          <Text style={styles.desc}>
            {breed.description || 'No description available for this breed yet.'}
          </Text>
        </View>

        {/* Favorites CTA */}
        <PressableScale onPress={() => toggleFavorite(breedId)} activeScale={0.97}>
          <LinearGradient
            colors={favorited ? ['#FF7B93', '#FF5E7E'] : ['#6C63FF', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.favBtn}
          >
            <View style={styles.favRow}>
              <MaterialCommunityIcons
                name={favorited ? 'heart' : 'heart-outline'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.favText}>
                {favorited ? 'In your favorites' : 'Save to favorites'}
              </Text>
            </View>
          </LinearGradient>
        </PressableScale>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#EFEDFB',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEDFB',
    padding: 24,
  },
  hero: {
    width: '100%',
    height: 300,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#E9E9FF',
    marginBottom: 14,
    boxShadow: '0 14px 32px rgba(99,102,241,0.25)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    pointerEvents: 'none',
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAction: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  heroActionCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(43,37,64,0.25)',
  },
  heroTitleFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 18,
    pointerEvents: 'none',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
  },
  originPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 8,
  },
  originText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E6E0F7',
    alignItems: 'center',
    boxShadow: '0 8px 20px rgba(99,102,241,0.12)',
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2B2540',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B87A3',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E6E0F7',
    boxShadow: '0 10px 28px rgba(99,102,241,0.14)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2B2540',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F4F2FE',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 14,
  },
  tempText: {
    flex: 1,
    color: '#4F46DB',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  desc: {
    fontSize: 14,
    lineHeight: 23,
    color: '#6E6A85',
  },
  favBtn: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
    boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
  },
  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  notFoundText: {
    fontSize: 16,
    color: '#8B87A3',
    marginBottom: 20,
    marginTop: 12,
  },
  backWrap: {
    width: '100%',
    maxWidth: 280,
  },
  backBtn: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});