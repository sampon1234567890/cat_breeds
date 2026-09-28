import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'meowpedia_favorites';

const FavoritesContext = createContext(null);

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved ids once on mount. Corrupt/missing data → empty list.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        setFavorites(Array.isArray(parsed) ? parsed.map(String) : []);
      } catch {
        setFavorites([]);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persist on change — only after the initial load so we never overwrite
  // stored favorites with the pre-load empty array.
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch {
        // storage write failed — favorites stay valid in memory for this session
      }
    })();
  }, [favorites, loaded]);

  const isFavorite = useCallback(
    (id) => favorites.includes(String(id)),
    [favorites]
  );

  const toggleFavorite = useCallback((id) => {
    const str = String(id);
    setFavorites((prev) =>
      prev.includes(str) ? prev.filter((f) => f !== str) : [...prev, str]
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}