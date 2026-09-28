import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import useRubberBand from '../../hooks/useRubberBand';

import { getBreeds, deleteBreed } from '../../api/breedApi';
import BreedCard from '../../components/BreedCard';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { useFavorites } from '../../context/FavoritesContext';

export default function FavoritesScreen() {
  const bounce = useRubberBand();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadBreeds = useCallback(async () => {
    try {
      const data = await getBreeds();
      setBreeds(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh whenever the user returns to this screen.
  useFocusEffect(
    useCallback(() => {
      loadBreeds();
    }, [loadBreeds])
  );

  const favoriteBreeds = useMemo(
    () => breeds.filter((b) => favorites.includes(String(b.id))),
    [breeds, favorites]
  );

  const performDelete = async () => {
    if (!pendingDelete) return;
    const breed = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteBreed(breed.id);
      showToast(`${breed.name} deleted`, 'delete');
      loadBreeds();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item, index }) => (
    <BreedCard
      breed={item}
      index={index}
      onEdit={() => router.push(`/edit/${item.id}`)}
      onDelete={() => setPendingDelete(item)}
      onPress={() => router.push(`/breed/${item.id}`)}
      isFavorite={isFavorite(String(item.id))}
      onToggleFavorite={() => toggleFavorite(String(item.id))}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Animated.View style={[styles.listWrap, bounce.animatedStyle]}>
        <FlatList
          data={favoriteBreeds}
          {...bounce.scrollProps}
          keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadBreeds();
            }}
            colors={['#6C63FF']}
            tintColor="#6C63FF"
          />
        }
        ListHeaderComponent={
          !loading ? (
            <View style={styles.headerCard}>
              <MaterialCommunityIcons
                name="heart"
                size={30}
                color="#FF5E7E"
                style={styles.headerEmoji}
              />
              <View style={styles.headerTextWrap}>
                <Text style={styles.headerTitle}>Favorites</Text>
                <Text style={styles.headerSub}>
                  {favoriteBreeds.length}{' '}
                  {favoriteBreeds.length === 1 ? 'saved breed' : 'saved breeds'}
                </Text>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyCard}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="heart-outline"
                size={64}
                color="#CDC9F4"
              />
              <Text style={styles.emptyText}>
                No favorites yet — tap the heart on a breed to save it.
              </Text>
            </View>
          )
        }
      />
      </Animated.View>

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Remove this breed?"
        message={
          pendingDelete ? `Are you sure you want to delete ${pendingDelete.name}?` : ''
        }
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={performDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEDFB',
  },
  listWrap: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6E0F7',
    boxShadow: '0 10px 28px rgba(99,102,241,0.14)',
  },
  headerEmoji: {
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2B2540',
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C63FF',
    marginTop: 2,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 44,
    paddingHorizontal: 24,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E6E0F7',
    boxShadow: '0 10px 28px rgba(99,102,241,0.12)',
  },
  emptyText: {
    color: '#8B87A3',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
  },
});