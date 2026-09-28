import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import PressableScale from './PressableScale';

export default function BreedCard({
  breed,
  index,
  onEdit,
  onDelete,
  onPress,
  isFavorite,
  onToggleFavorite,
}) {
  const entrance = useSharedValue(0);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    entrance.set(
      withDelay(
        Math.min(index * 90, 500),
        withSpring(1, { damping: 16, stiffness: 110 })
      )
    );
  }, [entrance, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: entrance.get(),
    transform: [
      { translateY: interpolate(entrance.get(), [0, 1], [26, 0]) },
      { scale: interpolate(entrance.get(), [0, 1], [0.96, 1]) },
    ],
  }));

  const showImage = !!breed.image_url && !imageFailed;

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.card}>
        {/* Photo — tapping opens the breed detail */}
        <PressableScale
          onPress={onPress}
          accessibilityLabel={`View ${breed.name}`}
        >
          <View>
            {showImage ? (
              <>
                <Image
                  source={{ uri: breed.image_url }}
                  style={styles.image}
                  contentFit="cover"
                  transition={250}
                  onError={() => setImageFailed(true)}
                />
                <LinearGradient
                  colors={['rgba(43,37,64,0)', 'rgba(43,37,64,0.28)']}
                  style={styles.imageFade}
                />
              </>
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                <MaterialCommunityIcons name="cat" size={64} color="#B9B4E4" />
              </View>
            )}
          </View>
        </PressableScale>

        {/* Heart overlay (not nested inside the photo pressable) */}
        <PressableScale
          style={styles.heartWrap}
          activeScale={0.85}
          onPress={onToggleFavorite}
          accessibilityLabel={`${isFavorite ? 'Remove' : 'Add'} ${breed.name} ${isFavorite ? 'from' : 'to'} favorites`}
        >
          <View
            style={[styles.heartCircle, isFavorite && styles.heartCircleActive]}
          >
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? '#FF5E7E' : '#9A96B8'}
            />
          </View>
        </PressableScale>

        <View style={styles.body}>
          {/* Text block — tapping also opens the breed detail */}
          <PressableScale
            onPress={onPress}
            accessibilityLabel={`View ${breed.name} details`}
          >
            <View>
              <View style={styles.titleRow}>
                <Text style={styles.name}>{breed.name}</Text>
                <View style={styles.originPill}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={13}
                    color="#4F46DB"
                  />
                  <Text style={styles.originText}>{breed.origin}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                {breed.lifespan ? (
                  <View style={styles.lifePill}>
                    <MaterialCommunityIcons
                      name="timer-sand"
                      size={13}
                      color="#2E5FD8"
                    />
                    <Text style={styles.lifeText}>{breed.lifespan}</Text>
                  </View>
                ) : null}
                {breed.temperament ? (
                  <View style={styles.tempRow}>
                    <MaterialCommunityIcons
                      name="emoticon-happy-outline"
                      size={15}
                      color="#6E6A85"
                    />
                    <Text style={styles.tempText}>{breed.temperament}</Text>
                  </View>
                ) : null}
              </View>

              {breed.description ? (
                <Text style={styles.desc}>{breed.description}</Text>
              ) : null}
            </View>
          </PressableScale>

          <View style={styles.actions}>
            <PressableScale
              style={styles.actionWrap}
              onPress={onEdit}
              accessibilityLabel={`Edit ${breed.name}`}
            >
              <View style={[styles.actionBtn, styles.editBtn]}>
                <MaterialCommunityIcons name="pencil" size={20} color="#4F46DB" />
              </View>
            </PressableScale>
            <PressableScale
              style={styles.actionWrap}
              onPress={onDelete}
              accessibilityLabel={`Delete ${breed.name}`}
            >
              <View style={[styles.actionBtn, styles.deleteBtn]}>
                <MaterialCommunityIcons name="delete" size={20} color="#E0454B" />
              </View>
            </PressableScale>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6E0F7',
    boxShadow: '0 10px 28px rgba(99,102,241,0.16)',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#E9E9FF',
  },
  imageFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    pointerEvents: 'none',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  heartCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(43,37,64,0.18)',
  },
  heartCircleActive: {
    backgroundColor: '#FFECEC',
    borderWidth: 1,
    borderColor: '#FFD9D9',
  },
  body: {
    padding: 18,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2B2540',
    flexShrink: 1,
  },
  originPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E9E9FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 8,
  },
  originText: {
    color: '#4F46DB',
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  lifePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DEE9FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lifeText: {
    color: '#2E5FD8',
    fontSize: 12,
    fontWeight: '700',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tempText: {
    color: '#6E6A85',
    fontSize: 13,
    fontWeight: '600',
  },
  desc: {
    color: '#8B87A3',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionWrap: {
    width: 46,
    height: 46,
  },
  actionBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99,102,241,0.18)',
  },
  editBtn: {
    backgroundColor: '#EBEBFF',
  },
  deleteBtn: {
    backgroundColor: '#FFECEC',
  },
});