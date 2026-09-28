import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ToastProvider } from '../components/Toast';
import { FavoritesProvider } from '../context/FavoritesContext';
import CatDoodle from '../components/CatDoodle';

const isWeb = Platform.OS === 'web';

export default function RootLayout() {
  // On desktop, fill the whole window so the app frame floats edge-to-edge.
  // `overflow: hidden` + a bounded frame prevents the document from scrolling
  // (which used to leave a stale scroll offset — and a white gap below the
  // phone frame — after form flows). In-app lists scroll in their own containers.
  useEffect(() => {
    if (!isWeb) return;
    document.documentElement.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100%';
    }
  }, []);

  return (
    <ToastProvider>
      <LinearGradient
        colors={isWeb ? ['#171233', '#2E2458', '#1E1940'] : ['#EFEDFB', '#EFEDFB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backdrop}
      >
      {isWeb ? (
        <>
          <CatDoodle
            size={280}
            opacity={0.16}
            rotate="-12deg"
            style={[styles.doodle, styles.doodleTL]}
          />
          <CatDoodle
            size={280}
            opacity={0.16}
            rotate="10deg"
            style={[styles.doodle, styles.doodleBR]}
          />
        </>
      ) : null}

      <View style={[styles.frame, isWeb && styles.frameWeb]}>
        <FavoritesProvider>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: '#EFEDFB' },
                headerShadowVisible: false,
                headerTintColor: '#6C63FF',
                headerTitleStyle: {
                  fontWeight: '800',
                  color: '#2B2540',
                  fontSize: 17,
                },
                headerTitleAlign: 'center',
                contentStyle: { backgroundColor: '#EFEDFB' },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="add-breed" options={{ title: 'New Breed' }} />
              <Stack.Screen name="edit/[id]" options={{ title: 'Edit Breed' }} />
              <Stack.Screen
                name="breed/[id]"
                options={{ title: 'Breed Details', headerShown: true }}
              />
            </Stack>
          </FavoritesProvider>
        </View>
      </LinearGradient>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#EFEDFB',
  },
  frameWeb: {
    maxWidth: 480,
    borderRadius: 30,
    overflow: 'hidden',
    marginVertical: 24,
    minHeight: 0,
    boxShadow:
      '0 0 0 1px rgba(255,255,255,0.10), 0 30px 90px rgba(8,5,25,0.55)',
  },
  doodle: {
    position: 'absolute',
  },
  doodleTL: {
    top: -70,
    left: -70,
  },
  doodleBR: {
    bottom: -70,
    right: -70,
  },
});