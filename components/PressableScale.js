import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// Wrap any tappable element for a bouncy press-scale animation (Reanimated).
export default function PressableScale({
  onPress,
  children,
  style,
  activeScale = 0.95,
  disabled,
  ...rest
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPressIn={() => {
          scale.set(withSpring(activeScale, { damping: 14, stiffness: 300 }));
        }}
        onPressOut={() => {
          scale.set(withSpring(1, { damping: 14, stiffness: 300 }));
        }}
        onPress={onPress}
        disabled={disabled}
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}