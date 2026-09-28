import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  onCancel,
  onConfirm,
}) {
  const pop = useSharedValue(0.85);

  useEffect(() => {
    if (visible) {
      pop.set(0.85);
      pop.set(withSpring(1, { damping: 12, stiffness: 200 }));
    }
  }, [visible, pop]);

  const dialogStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.get() }],
  }));

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.dialog, dialogStyle]}>
          <MaterialCommunityIcons name="paw" size={40} color="#6C63FF" />
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.confirmBtn]} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(43,37,64,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E0F7',
    boxShadow: '0 20px 50px rgba(43,37,64,0.35)',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2B2540',
    marginTop: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#8B87A3',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F0F0FE',
  },
  cancelText: {
    color: '#4F46DB',
    fontWeight: '700',
  },
  confirmBtn: {
    backgroundColor: '#FF5E7E',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});