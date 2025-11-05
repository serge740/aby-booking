import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  FlatList,
  Animated,
  ViewToken,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
}

const buildSlides = (t: (key: string) => any): Slide[] => {
  const slides = t('onboarding.slides', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }> ;

  return slides.map((s, i) => ({
    id: `${i + 1}`,
    title: s.title,
    description: s.description,
    image:
      i === 0
        ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'
        : i === 1
        ? 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'
        : 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
  }));
};

const LANGUAGE_KEY = 'user-language';

const OnboardingScreen = () => {
  const { t } = useTranslation();
  const slides = buildSlides(t);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<Slide> | null>(null);

  // Language modal state
  const [showLangModal, setShowLangModal] = useState(false);

  // Check if language is saved on mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (!saved) {
        setShowLangModal(true);
      }
    })();
  }, []);

  const handleLanguageSelect = async (lng: 'rw' | 'en' | 'fr') => {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    setShowLangModal(false);
  };

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  const handleSkip = () => {
    slidesRef.current?.scrollToIndex({ index: slides.length - 1 });
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <ImageBackground source={{ uri: item.image }} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
          locations={[0, 0.5, 0.75, 1]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  const Pagination = () => (
    <View style={styles.paginationContainer}>
      {slides.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={i.toString()}
            style={[styles.dot, { width: dotWidth, opacity, backgroundColor: '#FFF' }]}
          />
        );
      })}
    </View>
  );

  // Language Modal (rendered inline)
  const LanguageModal = () => {
    const options: Array<{ code: 'rw' | 'en' | 'fr'; name: string; flag: string }> = [
      { code: 'rw', name: 'Kinyarwanda', flag: 'Rwanda' },
      { code: 'en', name: 'English', flag: 'United States' },
      { code: 'fr', name: 'Français', flag: 'France' },
    ];

    return (
      <Modal transparent visible={showLangModal} animationType="fade">
        <View style={langStyles.overlay}>
          <SafeAreaView style={langStyles.card}>
            <Text style={langStyles.title}>Select Language</Text>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.code}
                style={langStyles.row}
                onPress={() => handleLanguageSelect(opt.code)}
              >
                <Text style={langStyles.flag}>{opt.flag}</Text>
                <Text style={langStyles.label}>{opt.name}</Text>
              </TouchableOpacity>
            ))}
          </SafeAreaView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Language Modal */}
      <LanguageModal />

      {/* Onboarding Content (only shown after language is picked) */}
      {!showLangModal && (
        <>
          {/* Header with Skip */}
          <SafeAreaView style={styles.header}>
            {currentIndex < slides.length - 1 && (
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
              </TouchableOpacity>
            )}
          </SafeAreaView>

          {/* Slides */}
          <FlatList<Slide>
            data={slides}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={item => item.id}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
            style={styles.flatList}
          />

          {/* Bottom Section */}
          <View style={styles.bottomContainer}>
            <Pagination />
            <TouchableOpacity style={styles.button} onPress={scrollTo}>
              {currentIndex === slides.length - 1 ? (
                <Text style={styles.buttonText}>{t('onboarding.getStarted')}</Text>
              ) : (
                <View style={styles.nextButtonContent}>
                  <Text style={styles.buttonText}>{t('onboarding.next')}</Text>
                  <Ionicons name="arrow-forward" size={20} color="#000" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Onboarding Styles (unchanged) */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
  },
  skipText: { fontSize: 16, color: '#FFF', fontWeight: '600' },
  flatList: { flex: 1 },
  slide: { flex: 1, height },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  gradient: { flex: 1, justifyContent: 'flex-end', paddingBottom: 180 },
  textContainer: { paddingHorizontal: 30 },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 16,
    color: '#FFF',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '700' },
  nextButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

/* ------------------------------------------------------------------ */
/* Language Modal Styles */
/* ------------------------------------------------------------------ */
const langStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  flag: {
    fontSize: 30,
    marginRight: 16,
  },
  label: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
});

export default OnboardingScreen;