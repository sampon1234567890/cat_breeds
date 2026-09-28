import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getRandomCatFact } from '../api/catFactApi';
import PressableScale from './PressableScale';

// "Cat Fact" banner — renders a random fact fetched live from the
// third-party Cat Facts API (https://catfact.ninja). Sits on top of the
// Home dashboard's list, self-contained: loads once, refreshes via the
// shuffle button, and shows retry UI if the request fails.
export default function CatFactCard() {
  const [fact, setFact] = useState('');
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'error'
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getRandomCatFact()
      .then((text) => {
        if (!active) return;
        setFact(text);
        setStatus('ok');
      })
      .catch(() => {
        if (!active) return;
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const refresh = useCallback(() => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconChip}>
          <MaterialCommunityIcons name="cat" size={15} color="#FFFFFF" />
        </View>
        <Text style={styles.label}>Cat Fact</Text>
        <PressableScale
          onPress={refresh}
          activeScale={0.85}
          disabled={status === 'loading'}
          style={styles.refreshBtn}
          accessibilityLabel="Get another cat fact"
        >
          <MaterialCommunityIcons
            name="refresh"
            size={18}
            color={status === 'loading' ? '#CDC9F4' : '#6C63FF'}
          />
        </PressableScale>
      </View>

      <View style={styles.body}>
        {status === 'loading' ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="small" color="#6C63FF" />
          </View>
        ) : status === 'error' ? (
          <Pressable onPress={refresh} hitSlop={8}>
            <Text style={styles.errorText}>Couldn&apos;t fetch a cat fact.</Text>
            <Text style={styles.errorRetry}>Tap to retry</Text>
          </Pressable>
        ) : (
          <>
            <View style={styles.factRow}>
              <MaterialCommunityIcons
                name="paw"
                size={14}
                color="#9B6DFF"
                style={styles.factIcon}
              />
              <Text style={styles.factText} numberOfLines={4}>
                {fact}
              </Text>
            </View>
            <Text style={styles.source}>Live from Cat Facts API</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E0F7',
    padding: 16,
    marginBottom: 14,
    boxShadow: '0 10px 28px rgba(99,102,241,0.12)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2B2540',
    flex: 1,
  },
  refreshBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F2FE',
  },
  body: {
    minHeight: 44,
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  factIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  factText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: '#4A4663',
    fontWeight: '600',
  },
  source: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#9A96B8',
  },
  errorText: {
    fontSize: 14,
    color: '#FF5E7E',
    fontWeight: '700',
  },
  errorRetry: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '800',
    marginTop: 4,
  },
});