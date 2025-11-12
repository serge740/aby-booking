import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  Animated,
  ViewToken,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';
import ThemedView from '@/components/themed/ThemedView';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#FF8C42';
const OUTER_COLOR = '#FFE5B4';

interface Slide {
  id: string;
  image: any;
  title: string;
  description: string;
}

const buildSlides = (t: (key: string) => any): Slide[] => {
  const slides = t('onboarding.slides', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const images = [
    require('../../assets/feature/image3.png'),
    require('../../assets/feature/image2.png'),
    require('../../assets/feature/image1.png'),
  ];

  return slides.map((s, i) => ({
    id: `${i + 1}`,
    image: images[i],
    title: s.title,
    description: s.description,
  }));
};

const LANGUAGE_KEY = 'user-language';

const OnboardingScreen = () => {
  const { t } = useTranslation();
  const slides = buildSlides(t);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<Slide> | null>(null);
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (!saved) setShowLangModal(true);
    })();
  }, []);

  const handleLanguageSelect = async (lng: 'rw' | 'en' | 'fr') => {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
    setShowLangModal(false);
  };

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index ?? 0);
    },
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/(auth)/login');
    }
  };

  const handleSkip = () => {
    slidesRef.current?.scrollToIndex({ index: slides.length - 1 });
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      slidesRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      {/* IMAGE */}
      <View style={styles.imageContainer}>
        <View style={styles.outerCircle} />
        <View style={styles.innerCircle}>
          <View style={styles.imageWrapper}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
          </View>
        </View>
      </View>

      {/* TEXT */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const Pagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 30, 10],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
                backgroundColor: i === currentIndex ? PRIMARY_COLOR : '#D3D3D3',
              },
            ]}
          />
        );
      })}
    </View>
  );

  const LanguageModal = () => {
    const options = [
      { code: 'rw', name: 'Kinyarwanda', flag: 'Rwanda' },
      { code: 'en', name: 'English', flag: 'USA' },
      { code: 'fr', name: 'Français', flag: 'France' },
    ];
    return (
      <Modal transparent visible={showLangModal} animationType="fade">
        <View style={langStyles.overlay}>
          <View style={langStyles.card}>
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
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ThemedView safe={false} style={styles.container}>
      <LanguageModal />

      {!showLangModal && (
        <>
          <SafeAreaView style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              disabled={currentIndex === 0}
              style={[styles.iconBtn, currentIndex === 0 && styles.disabled]}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            {currentIndex < slides.length - 1 && (
              <TouchableOpacity onPress={handleSkip} style={styles.iconBtn}>
                <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
              </TouchableOpacity>
            )}
          </SafeAreaView>

          <FlatList
            data={slides}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
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

          {/* TIGHTER BOTTOM SECTION */}
          <View style={styles.bottomContainer}>
            <Pagination />
            <TouchableOpacity style={styles.nextBtn} onPress={scrollTo}>
              {/* ----  NEXT / GET STARTED  ---- */}
              {currentIndex === slides.length - 1 ? (
                <>
                  <Text style={styles.nextBtnText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={28} color="#FFF" style={styles.nextBtnIcon} />
                </>
              ) : (
                <>
                  <Text style={styles.nextBtnText}>Next</Text>
                  <Ionicons name="arrow-forward" size={28} color="#FFF" style={styles.nextBtnIcon} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </ThemedView>
  );
};

/* ────────────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.020,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconBtn: { padding: 8 },
  disabled: { opacity: 0.3 },
  skipText: { fontSize: 16, paddingRight: 10, fontWeight: '600', color: '#333' },

  flatList: { flex: 1 },

  slide: {
    width,
    paddingHorizontal: width * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },

  // IMAGE
  imageContainer: { flex: 0.5, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  outerCircle: {
    position: 'absolute',
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: OUTER_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  innerCircle: {
    width: width * 0.68,
    height: width * 0.68,
    borderRadius: (width * 0.68) / 2,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  imageWrapper: {
    width: width * 0.58,
    height: width * 0.58,
    backgroundColor: 'transparent',
    borderRadius: (width * 0.58) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: '92%', height: '92%' },

  // TEXT
  textContainer: {
    flex: 0.35,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.06,
    marginTop: height * 0.015,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: width * 0.09,
    letterSpacing: -0.5,
  },
  description: {
    marginTop: height * 0.015,
    fontSize: width * 0.042,
    color: '#666',
    textAlign: 'center',
    lineHeight: width * 0.06,
  },

  // BOTTOM – TIGHTER
  bottomContainer: {
    paddingHorizontal: width * 0.08,
    paddingBottom: height * 0.04,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: height * 0.025,
  },
  dot: { height: 9, borderRadius: 5, marginHorizontal: 6 },

  // ----  NEXT BUTTON WITH TEXT + ICON  ----
  nextBtn: {
    backgroundColor: '#2C2C2C',
    width: '80%',
    height: 50,
    borderRadius: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  nextBtnIcon: {
    marginLeft: 2,
  },
});

const langStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 32, width: '88%', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 28, color: '#000' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, width: '100%', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  flag: { fontSize: 32, marginRight: 16 },
  label: { fontSize: 18, fontWeight: '600', color: '#000' },
});

export default OnboardingScreen;