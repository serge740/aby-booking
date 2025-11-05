import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BANNER_HEIGHT = 180;
const BANNER_TEXT = [
  { title: 'Book Your Ride', subtitle: 'Fast, Safe, Affordable' },
  { title: 'Explore Rwanda', subtitle: 'Public Transport Made Easy' },
  { title: 'Real-Time Tracking', subtitle: 'Know Where Your Bus Is' },
  { title: 'Go Green', subtitle: 'Eco-Friendly Travel' },
];

const bannerData = [
  'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'https://images.unsplash.com/photo-1581262177000-8c2a0f2c0b5f?w=800&q=80',
  'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&q=80',
];

const masonryItems = [
  { id: 1, image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=400&q=80', height: 140 },
  { id: 2, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80', height: 170 },
  { id: 3, image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80', height: 150 },
  { id: 4, image: 'https://images.unsplash.com/photo-1581262177000-8c2a0f2c0b5f?w=400&q=80', height: 160 },
  { id: 5, image: 'https://images.unsplash.com/photo-1552901239-4e29e2d281a5?w=400&q=80', height: 135 },
  { id: 6, image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80', height: 155 },
];

export default function HomeScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef(null);
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeSlide + 1) % bannerData.length;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });

      textAnim.setValue(-50);
      Animated.spring(textAnim, {
        toValue: 0,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();

      setActiveSlide(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeSlide, textAnim]);

  const renderBannerItem = ({ item, index }) => (
    <View style={{ width }}>
      <Image source={{ uri: item }} style={styles.bannerImage} />
      
      {/* Dark Overlay (No Gradient) */}
      <View style={styles.bannerOverlay} />

      {/* Banner Text with Slide-in */}
      <Animated.View style={[styles.bannerTextContainer, { transform: [{ translateX: textAnim }] }]}>
        <Text style={styles.bannerTitle}>{BANNER_TEXT[index].title}</Text>
        <Text style={styles.bannerSubtitle}>{BANNER_TEXT[index].subtitle}</Text>
      </Animated.View>
    </View>
  );

  const renderMasonryColumn = (items: any[]) => {
    return items.map((item) => (
      <TouchableOpacity key={item.id} style={[styles.masonryItem, { height: item.height }]}>
        <Image source={{ uri: item.image }} style={styles.masonryImage} />
        {/* Subtle dark overlay on masonry */}
        <View style={styles.masonryOverlay} />
      </TouchableOpacity>
    ));
  };

  const leftColumn = masonryItems.filter((_, i) => i % 2 === 0);
  const rightColumn = masonryItems.filter((_, i) => i % 2 !== 0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
         <View style={styles.header}>
      <Image
        source={require('../../assets/logo/logo.png')}
        style={styles.logoImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.logo}>Aby Ticket</Text>
        <Text style={styles.logoSubtext}>Rwanda Transport</Text>
      </View>
    </View>

          {/* Banner Carousel */}
          <View style={styles.bannerWrapper}>
            <FlatList
              ref={flatListRef}
              data={bannerData}
              renderItem={renderBannerItem}
              keyExtractor={(_, i) => i.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              bounces={false}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
            />
            <View style={styles.indicatorWrapper}>
              {bannerData.map((_, i) => (
                <View
                  key={i}
                  style={[styles.indicator, i === activeSlide && styles.activeIndicator]}
                />
              ))}
            </View>
          </View>

          {/* Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Our Services</Text>
            <Text style={styles.sectionSubtitle}>
              Discover the best public transport experience in Rwanda
            </Text>
          </View>

          {/* Masonry */}
          <View style={styles.masonryContainer}>
            <View style={styles.masonryColumn}>{renderMasonryColumn(leftColumn)}</View>
            <View style={styles.masonryColumn}>{renderMasonryColumn(rightColumn)}</View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0e8a74', // Notch matches app
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
    header: {
    flexDirection: 'row',       // Arrange children horizontally
    alignItems: 'center',       // Vertically center items
    padding: 10, 
    paddingTop:40,               // Add some padding
    backgroundColor: '#fff',
        // Optional: background color
  },
  logoImage: {
    width: 150,                  // Width of your logo
    height: 80,                 // Height of your logo
    resizeMode: 'cover',      // Maintain aspect ratio
    marginRight:10,            // Space between image and text
  },
  textContainer: {
    justifyContent: 'center',   // Vertically center the text
  },
  logo: {
    fontSize: 25,
    transform:"uppercase",
    fontWeight: 'bold',
    color: '#333',
  },
  logoSubtext: {
    fontSize: 14,
    color: '#666',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 25,
    gap: 6,
  },
  locationIcon: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  pickLocation: {
    fontSize: 10,
    color: '#888',
  },
  bannerWrapper: {
    height: BANNER_HEIGHT,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Solid dark overlay
  },
  bannerTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#eee',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  indicatorWrapper: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  
  indicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    width: 20,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#0e8a74',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 13.5,
    color: '#555',
    lineHeight: 19,
    marginTop: 4,
  },
  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  masonryColumn: {
    flex: 1,
    gap: 10,
  },
  masonryItem: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
  },
  masonryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  masonryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Subtle tint
  },
});