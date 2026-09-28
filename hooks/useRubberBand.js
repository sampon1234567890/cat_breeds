import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// How strongly the overscroll "rubber-bands" (0–1). 0.35 ≈ phone-like feel.
const DAMPING = 0.35;
const BOUNCE = { damping: 13, stiffness: 170 };

/**
 * Phone-style rubber-band bounce: pull past the very top (list drops down)
 * or past the very bottom (list rises), then spring back on release.
 *
 * Returned `scrollProps` spread onto a ScrollView / FlatList, and
 * `animatedStyle` spread onto a wrapping Animated.View:
 *
 *   const bounce = useRubberBand();
 *   <Animated.View style={[styles.listWrap, bounce.animatedStyle]}>
 *     <FlatList {...bounce.scrollProps} ... />
 *   </Animated.View>
 *
 * Note: `onScroll` is a plain JS callback (not `useAnimatedScrollHandler`)
 * because react-native-web requires `onScroll` to be a plain function.
 */
export default function useRubberBand() {
  const offset = useSharedValue(0); // current scrollY
  const viewportH = useSharedValue(0); // visible height
  const contentH = useSharedValue(0); // scrollable content height
  const pull = useSharedValue(0); // live overscroll translate
  const startY = useSharedValue(0);
  const direction = useSharedValue(0); // 1 = at top, -1 = at bottom, 0 = mid

  const onScroll = (e) => {
    offset.set(e.nativeEvent.contentOffset.y);
  };

  const onLayout = (e) => {
    viewportH.set(e.nativeEvent.layout.height);
  };

  const onContentSizeChange = (w, h) => {
    contentH.set(h);
  };

  const onTouchStart = (e) => {
    startY.set(e.nativeEvent.pageY ?? 0);
    const maxY = contentH.get() - viewportH.get();
    if (offset.get() <= 0) direction.set(1);
    else if (maxY > 0 && offset.get() >= maxY - 1) direction.set(-1);
    else direction.set(0);
  };

  const onTouchMove = (e) => {
    if (direction.get() === 0) return;
    const dy = e.nativeEvent.pageY - startY.get();
    const raw = direction.get() === 1 ? Math.max(dy, 0) : Math.min(dy, 0);
    pull.set(raw * DAMPING);
  };

  const onTouchEnd = () => {
    if (pull.get() !== 0) pull.set(withSpring(0, BOUNCE));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pull.get() }],
  }));

  return {
    scrollProps: {
      onScroll,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onContentSizeChange,
      onLayout,
      scrollEventThrottle: 16,
    },
    animatedStyle,
  };
}