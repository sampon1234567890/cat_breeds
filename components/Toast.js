import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }) {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const [item, setItem] = useState(null);
  const hideTimer = useRef(null);
  const removeTimer = useRef(null);
  const itemId = useRef(0);

  const hide = useCallback(() => {
    progress.set(withTiming(0, { duration: 220 }));
    // Unmount the toast right after the exit animation finishes, so no
    // invisible overlay is left covering the UI.
    const id = itemId.current;
    if (removeTimer.current) clearTimeout(removeTimer.current);
    removeTimer.current = setTimeout(() => {
      setItem((current) => (current && current.id === id ? null : current));
    }, 260);
  }, [progress]);

  const showToast = useCallback(
    (message, icon = 'paw') => {
      const id = ++itemId.current;
      setItem({ id, message, icon });
      progress.set(0);
      progress.set(withTiming(1, { duration: 220 }));
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(hide, 1700);
    },
    [progress, hide]
  );

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (removeTimer.current) clearTimeout(removeTimer.current);
    },
    []
  );

  const toastStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [
      { scale: interpolate(progress.get(), [0, 1], [0.8, 1]) },
      { translateY: interpolate(progress.get(), [0, 1], [12, 0]) },
    ],
  }));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {item ? (
        <View style={[styles.overlay, { width, height }]}>
          <Animated.View style={[styles.toast, toastStyle]}>
            <LinearGradient
              colors={['#6C63FF', '#9B6DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.toastInner}
            >
              {/* Cat logo badge, centered at the top of the box */}
              <View style={styles.logoBadge}>
                <MaterialCommunityIcons name="cat" size={26} color="#FFFFFF" />
              </View>
              {/* Notification text pinned to the bottom */}
              <View style={styles.messageRow}>
                {item.icon ? (
                  typeof item.icon === 'string' && Array.from(item.icon).length === 1 ? (
                    <Text style={styles.actionEmoji}>{item.icon}</Text>
                  ) : (
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={16}
                      color="#FFFFFF"
                      style={styles.actionIcon}
                    />
                  )
                ) : null}
                <Text style={styles.text} numberOfLines={2}>
                  {item.message}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    // Explicit position + the window dimensions are applied at runtime
    // (absoluteFill stretch isn't reliable on Android here — the overlay
    // used to collapse to its content and anchor at the bottom).
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 10,
    pointerEvents: 'none',
  },
  toast: {
    borderRadius: 26,
    boxShadow: '0 18px 40px rgba(99,102,241,0.55)',
  },
  toastInner: {
    minWidth: 210,
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 28,
    borderRadius: 26,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 6,
  },
  actionEmoji: {
    fontSize: 15,
    lineHeight: 18,
    marginRight: 6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    flexShrink: 1,
  },
});