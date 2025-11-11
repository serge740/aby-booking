/* eslint-disable import/no-duplicates */
/* eslint-disable no-dupe-keys */
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../../components/Guest/Header';
import { BannerCarousel, BannerItem } from '../../components/Guest/BannerCarousel';
import { FeaturedCategories } from '../../components/Guest/FeaturedCategories';
import { COLORS } from '../../constants/colors';

// ── BANNER DATA ─────────────────────────────────────
const bannerData: BannerItem[] = [
  {
    id: 1,
    image: require('../../assets/logo/aby_booking.png'),
    title: 'Fresh Flavors Await',
    description: 'Discover delicious meals from top restaurants',
  },
  {
    id: 2,
    image: require('../../assets/logo/aby_booking.png'),
    title: 'Fast Delivery',
    description: 'Get your favorite food delivered in minutes',
  },
  {
    id: 3,
    image: require('../../assets/logo/aby_booking.png'),
    title: 'Special Offers',
    description: 'Save big with exclusive deals and discounts',
  },
];

// ── IMPORT IMAGES ───────────────────────────────────────
// eslint-disable-next-line import/first
import Image1 from '../../assets/feature/image1.avif';
import Image2 from '../../assets/feature/image2.avif';
import Image3 from '../../assets/feature/image3.webp';
import Image4 from '../../assets/feature/image1.avif';
import Image5 from '../../assets/feature/image5.webp';
import Image6 from '../../assets/feature/image6.webp';
import Image7 from '../../assets/feature/image8.webp';

// ── CATEGORIES ──────────────────────────────────────────
const categories = [
  { id: 1, title: 'Dairy, Bread ', imageUrl: Image1 },
  { id: 2, title: 'Snack & Munchies', imageUrl: Image2 },
  { id: 3, title: 'Bakery & Biscuits', imageUrl: Image3 },
  { id: 4, title: 'Instant Food', imageUrl: Image4 },
  { id: 5, title: 'Tea, Coffee', imageUrl: Image5 },
  { id: 6, title: 'Atta, Rice & Dal', imageUrl: Image6 },
  { id: 7, title: ' Vegetables', imageUrl: Image7 },
];

// ── PRESS HANDLER ───────────────────────────────────────
const handleCategoryPress = (item: any) => {
  console.log('Selected category:', item.title);
};

// ── MASONRY GRID COMPONENT ──────────────────────────────
const MasonryGrid = () => {
  const { width } = Dimensions.get('window');
  const columnWidth = (width - 48) / 2; // 16px padding on sides + 16px gap
  const gap = 12;

  // Split into two columns with alternating heights
  const leftColumn: typeof categories = [];
  const rightColumn: typeof categories = [];

  categories.forEach((item, index) => {
    if (index % 2 === 0) {
      leftColumn.push(item);
    } else {
      rightColumn.push(item);
    }
  });

  const renderItem = (item: typeof categories[0], isTall: boolean = false) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.masonryItem,
        {
          width: columnWidth,
          height: isTall ? 220 : 160,
          marginBottom: gap,
        },
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <Image source={item.imageUrl} style={styles.masonryImage} resizeMode="cover" />
      <View style={styles.masonryOverlay}>
        <Text style={styles.masonryTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.masonryContainer}>
      <View style={styles.masonryColumn}>
        {leftColumn.map((item, idx) => renderItem(item, idx % 3 === 0))}
      </View>
      <View style={[styles.masonryColumn, { marginLeft: gap }]}>
        {rightColumn.map((item, idx) => renderItem(item, idx % 3 !== 0))}
      </View>
    </View>
  );
};

// ── MAIN COMPONENT ──────────────────────────────────────
export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <Header />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <BannerCarousel data={bannerData} />

          {/* FEATURED CATEGORIES */}
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Categories</Text>
            <FeaturedCategories data={categories} onPress={handleCategoryPress} />
          </View>

          {/* MASONRY GRID SECTION */}
          <View style={styles.masonrySection}>
            <Text style={styles.sectionTitle}>Explore More</Text>
            <MasonryGrid />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* ────────────────────── STYLES ────────────────────── */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    backgroundColor: COLORS.white,
    paddingBottom: 40,
  },

  featuredSection: {
    paddingHorizontal: 4,
    paddingTop: 32,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -22,
    paddingBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 16,
    marginLeft: 4,
  },

  // ── MASONRY STYLES ───────────────────────────────────
  masonrySection: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 32,
    backgroundColor: '#fff',
  },

  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  masonryColumn: {
    flex: 1,
  },

  masonryItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  masonryImage: {
    width: '100%',
    height: '100%',
  },

  masonryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },

  masonryTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});