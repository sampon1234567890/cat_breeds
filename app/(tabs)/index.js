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
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import useRubberBand from '../../hooks/useRubberBand';

import { getBreeds, deleteBreed } from '../../api/breedApi';
import BreedCard from '../../components/BreedCard';
import HeroHeader from '../../components/HeroHeader';
import FilterBar from '../../components/FilterBar';
import CatFactCard from '../../components/CatFactCard';
import PressableScale from '../../components/PressableScale';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { useFavorites } from '../../context/FavoritesContext';

export default function IndexScreen() {
  const bounce = useRubberBand();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('all');
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

  // Refresh whenever the user returns to this screen (after add/edit).
  useFocusEffect(
    useCallback(() => {
      loadBreeds();
    }, [loadBreeds])
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return breeds;
    return breeds.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.origin.toLowerCase().includes(query)
    );
  }, [breeds, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case 'popular':
        return list.sort(
          (a, b) => (Number(b.popularity) || 0) - (Number(a.popularity) || 0)
        );
      case 'searched':
        return list.sort(
          (a, b) => (Number(b.search_count) || 0) - (Number(a.search_count) || 0)
        );
      case 'newest':
        return list.sort((a, b) => Number(b.id) - Number(a.id));
      case 'az':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'za':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  }, [filtered, sort]);

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
      <StatusBar style="light" />
      <HeroHeader search={search} onChangeSearch={setSearch} />

      <Animated.View style={[styles.listWrap, bounce.animatedStyle]}>
        <FlatList
          data={sorted}
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
            <>
              <CatFactCard />
              <FilterBar count={filtered.length} sort={sort} onChangeSort={setSort} />
            </>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyCard}>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="paw" size={64} color="#CDC9F4" />
              <Text style={styles.emptyText}>
                {search
                  ? 'No breeds match your search.'
                  : 'No breeds yet — tap + to add one!'}
              </Text>
            </View>
          )
        }
      />
      </Animated.View>

      <PressableScale
        style={styles.fab}
        activeScale={0.88}
        onPress={() => router.push('/add-breed')}
      >
        <LinearGradient
          colors={['#6C63FF', '#4F46DB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabInner}
        >
          <MaterialCommunityIcons name="plus" size={34} color="#FFFFFF" />
        </LinearGradient>
      </PressableScale>

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
    paddingBottom: 120,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
  },
  fabInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 26px rgba(99,102,241,0.5)',
  },
});