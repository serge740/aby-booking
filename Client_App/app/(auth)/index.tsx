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
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';
import ThemedView from '@/components/themed/ThemedView';

const { width, height } = Dimensions.get('window');

// Primary brand color
const PRIMARY_COLOR = '#FF8C42';

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
  }>;

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
  const [showLangModal, setShowLangModal] = useState(false);

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
        <View style={styles.imageOverlay} />
      </ImageBackground>
      
      <View style={styles.contentCard}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          <View style={styles.paginationWrapper}>
            <Pagination />
          </View>
          
          <TouchableOpacity style={styles.button} onPress={scrollTo}>
            <View style={styles.buttonContent}>
              {currentIndex === slides.length - 1 ? (
                <Text style={styles.buttonText}>{t('onboarding.getStarted')}</Text>
              ) : (
                <Text style={styles.buttonText}>{t('onboarding.next')}</Text>
              )}
              <View style={styles.iconCircle}>
                <Ionicons name="arrow-forward" size={20} color={PRIMARY_COLOR} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
            style={[styles.dot, { width: dotWidth, opacity }]}
          />
        );
      })}
    </View>
  );

  const LanguageModal = () => {
    const options: Array<{ code: 'rw' | 'en' | 'fr'; name: string; flag: string }> = [
      { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
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
    <ThemedView safe={true} style={styles.container}>
      <LanguageModal />

      {!showLangModal && (
        <>
          <SafeAreaView style={styles.header}>
            {currentIndex < slides.length - 1 && (
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
              </TouchableOpacity>
            )}
          </SafeAreaView>

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
        </>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
  },
  skipText: { 
    fontSize: 14, 
    color: '#FFF', 
    fontWeight: '600' 
  },
  flatList: { 
    flex: 1 
  },
  slide: { 
    flex: 1, 
    height,
    backgroundColor: PRIMARY_COLOR,
  
    
  },
  backgroundImage: { 
    width: '100%', 
    height: height * 0.55,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 140, 66, 0.1)',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
    paddingTop: 40,
    paddingHorizontal: 30,
   
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  paginationWrapper: {
    marginVertical: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: { 
    height: 8, 
    borderRadius: 4, 
    marginHorizontal: 4,
    backgroundColor: PRIMARY_COLOR
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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