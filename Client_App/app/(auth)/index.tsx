import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// Import info
import info from '@/constants/info';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Track Your Packages',
    description: 'Get real-time updates on all your shipments and never miss a delivery',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80', // Package delivery image
  },
  {
    id: '2',
    title: 'Fast & Secure Delivery',
    description: 'Your packages are safe with us. We ensure secure and timely delivery every time',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80', // Delivery truck image
  },
  {
    id: '3',
    title: 'Easy Management',
    description: 'Manage all your shipments in one place with our intuitive interface',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', // Mobile phone management image
  }
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollX = useRef<Animated.Value>(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<Slide> | null>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

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
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index: slides.length - 1 });
    }
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
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

  const Pagination = () => {
    return (
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
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: '#FFF'
                }
              ]}
              key={i.toString()}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Skip */}
      <SafeAreaView style={styles.header}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
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
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
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
        <TouchableOpacity
          style={styles.button}
          onPress={scrollTo}
        >
          {currentIndex === slides.length - 1 ? (
            <Text style={styles.buttonText}>Get Started</Text>
          ) : (
            <View style={styles.nextButtonContent}>
              <Text style={styles.buttonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    flex: 1,
    height: height,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 180,
  },
  textContainer: {
    paddingHorizontal: 30,
  },
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
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
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
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default OnboardingScreen;