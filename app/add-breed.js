import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { saveBreed } from '../api/breedApi';
import useRubberBand from '../hooks/useRubberBand';
import CatDoodle from '../components/CatDoodle';
import FormField from '../components/FormField';
import PressableScale from '../components/PressableScale';
import { useToast } from '../components/Toast';

export default function AddBreedScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const bounce = useRubberBand();
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [temperament, setTemperament] = useState('');
  const [lifespan, setLifespan] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = name.trim() !== '' && origin.trim() !== '' && !saving;

  const handleSave = async () => {
    if (!name.trim() || !origin.trim()) {
      Alert.alert('Missing Info', 'Name and Origin are required.');
      return;
    }
    setSaving(true);
    try {
      await saveBreed({
        name: name.trim(),
        origin: origin.trim(),
        temperament: temperament.trim(),
        lifespan: lifespan.trim(),
        image_url: imageUrl.trim(),
        description: description.trim(),
      });
      showToast('Breed created', 'party-popper');
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setSaving(false);
    }
  };

  return (
    <Animated.View style={[styles.screen, bounce.animatedStyle]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        {...bounce.scrollProps}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#6C63FF', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <CatDoodle
            size={92}
            opacity={0.12}
            rotate="-8deg"
            style={{ position: 'absolute', right: -14, top: -8 }}
          />
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="cat" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Add a new breed</Text>
          <Text style={styles.heroSub}>
            Share a feline friend with the encyclopedia
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons name="paw" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.sectionTitle}>Basics</Text>
            </View>
            <FormField
              label="Name *"
              icon="pencil"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Siamese"
            />
            <FormField
              label="Origin *"
              icon="map-marker"
              value={origin}
              onChangeText={setOrigin}
              placeholder="e.g. Thailand"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.sectionTitle}>Details</Text>
            </View>
            <FormField
              label="Temperament"
              icon="emoticon-happy-outline"
              value={temperament}
              onChangeText={setTemperament}
              placeholder="e.g. Vocal, Social, Playful"
            />
            <FormField
              label="Lifespan"
              icon="timer-sand"
              value={lifespan}
              onChangeText={setLifespan}
              placeholder="e.g. 12–17 years"
            />
            <FormField
              label="Image URL"
              icon="image"
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://…"
              keyboardType="url"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <MaterialCommunityIcons
                  name="text-box-outline"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <FormField
              label="Description"
              icon="text"
              value={description}
              onChangeText={setDescription}
              placeholder="A short description of the breed…"
              multiline
            />
          </View>
        </View>

        <PressableScale onPress={handleSave} disabled={saving} activeScale={0.97}>
          <LinearGradient
            colors={!canSave ? ['#CDC9F4', '#CDC9F4'] : ['#6C63FF', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveBtn}
          >
            <View style={styles.saveRow}>
              <MaterialCommunityIcons
                name={saving ? 'clock-outline' : 'plus'}
                size={21}
                color="#FFFFFF"
              />
              <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save Breed'}</Text>
            </View>
          </LinearGradient>
        </PressableScale>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#EFEDFB',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  hero: {
    borderRadius: 26,
    paddingVertical: 26,
    paddingHorizontal: 22,
    marginBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
    boxShadow: '0 12px 28px rgba(99,102,241,0.3)',
  },
  heroBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6E0F7',
    boxShadow: '0 10px 28px rgba(99,102,241,0.14)',
  },
  section: {
    paddingHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    marginTop: 2,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2B2540',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEAFB',
    marginVertical: 6,
  },
  saveBtn: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
    boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});