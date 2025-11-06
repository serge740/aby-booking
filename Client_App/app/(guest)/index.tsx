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
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 220;

const COLORS = {
  primary: '#FF6B35',
  secondary: '#F7931E',
  accent: '#E63946',
  dark: '#1A1A1A',
  gray: '#666',
  lightGray: '#f5f5f5',
  white: '#fff',
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const textAnim = useRef(new Animated.Value(0)).current;

  const categories = t('guest.index.categories', { returnObjects: true }) as Array<{ title: string; subtitle: string }>;
  const stats = t('guest.index.stats', { returnObjects: true }) as { businesses: string; customers: string; orders: string };
  const bannerTexts = t('guest.index.banner', { returnObjects: true }) as Array<{ title: string; subtitle: string }>;

  // Banner carousel data
  const bannerData = [
    { id: 1, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80' },
    { id: 2, image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80' },
    { id: 3, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80' },
    { id: 4, image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80' },
  ];

  const categoryItems = [
    { id: 1, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', size: 'large', icon: 'restaurant' },
    { id: 2, image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80', size: 'medium', icon: 'cart' },
    { id: 3, image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80', size: 'medium', icon: 'wine' },
    { id: 4, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', size: 'small', icon: 'fast-food' },
    { id: 5, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80', size: 'small', icon: 'beer' },
    { id: 6, image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&q=80', size: 'small', icon: 'cafe' },
  ];

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
    }, 4500);

    return () => clearInterval(interval);
  }, [activeSlide, textAnim]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderBannerItem = ({ item, index }: { item: typeof bannerData[0]; index: number }) => {
    const { title, subtitle } = bannerTexts[index];

    return (
      <View style={{ width }}>
        <Image source={{ uri: item.image }} style={styles.bannerImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.bannerOverlay}
        />
        <Animated.View style={[styles.bannerTextContainer, { transform: [{ translateX: textAnim }] }]}>
          <Text style={styles.bannerTitle}>{title}</Text>
          <Text style={styles.bannerSubtitle}>{subtitle}</Text>
        </Animated.View>
      </View>
    );
  };

  const renderCategoryItem = (item: typeof categoryItems[0], textIndex: number) => {
    const { title, subtitle } = categories[textIndex];
    const itemStyle = item.size === 'large' 
      ? styles.largeItem 
      : item.size === 'medium' 
      ? styles.mediumItem 
      : styles.smallItem;

    return (
      <TouchableOpacity key={item.id} style={[styles.categoryItem, itemStyle]}>
        <Image source={{ uri: item.image }} style={styles.categoryImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.65)']}
          style={styles.categoryOverlay}
        />
        <View style={styles.categoryContent}>
          <LinearGradient
            colors={['#FF6B35', '#FF4757']}
            style={styles.iconCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={item.icon as any} size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.categorySubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Fixed Header */}
        <Animated.View >
          <LinearGradient
            colors={['#FF6B35', '#FF4757']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Image source={require('../../assets/logo/aby_booking.png')} style={styles.headerLogo} />
              <Text style={styles.headerTitle}>{t('guest.index.app_name')}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <Animated.ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Hero Section */}
          <LinearGradient
            colors={['#FF6B35', '#FF4757']}
            style={styles.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <Image source={require('../../assets/logo/aby_booking.png')} style={styles.heroLogo} />
              <Text style={styles.heroTitle}>{t('guest.index.hero_title')}</Text>
              <Text style={styles.heroSubtitle}>{t('guest.index.hero_subtitle')}</Text>
              
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.gray} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('guest.index.search_placeholder')}
                  placeholderTextColor={COLORS.gray}
                />
                <Ionicons name="options-outline" size={20} color={COLORS.primary} />
              </View>

              {/* Location */}
              <View style={styles.locationTag}>
                <Ionicons name="location" size={16} color={COLORS.accent} />
                <Text style={styles.locationText}>{t('guest.index.location')}</Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.dark} />
              </View>
            </View>
          </LinearGradient>

          {/* Banner Carousel */}
          <View style={styles.bannerWrapper}>
            <FlatList
              ref={flatListRef}
              data={bannerData}
              renderItem={renderBannerItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              bounces={false}
              getItemLayout={(_, index) => ({
                length: width - 40,
                offset: (width - 40) * index,
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

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['#FF6B35', '#FF4757']}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="storefront" size={28} color={COLORS.white} />
              <Text style={styles.statNumber}>{stats.businesses.split(' ')[0]}</Text>
              <Text style={styles.statLabel}>{stats.businesses.split(' ').slice(1).join(' ')}</Text>
            </LinearGradient>
            <LinearGradient
              colors={['#FF6B35', '#FF4757']}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="people" size={28} color={COLORS.white} />
              <Text style={styles.statNumber}>{stats.customers.split(' ')[0]}</Text>
              <Text style={styles.statLabel}>{stats.customers.split(' ').slice(1).join(' ')}</Text>
            </LinearGradient>
            <LinearGradient
              colors={['#FF6B35', '#FF4757']}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="checkmark-circle" size={28} color={COLORS.white} />
              <Text style={styles.statNumber}>{stats.orders.split(' ')[0]}</Text>
              <Text style={styles.statLabel}>{stats.orders.split(' ').slice(1).join(' ')}</Text>
            </LinearGradient>
          </View>

          {/* What is Aby Booking Section */}
          <View style={styles.whatSection}>
            <View style={styles.whatHeader}>
              <LinearGradient
                colors={['#FF6B35', '#FF4757']}
                style={styles.sparkle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="restaurant" size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.whatTitle}>{t('guest.index.what_title')}</Text>
            </View>
            <Text style={styles.whatText}>{t('guest.index.what_text')}</Text>
          </View>

          {/* Categories Section - Hierarchical Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('guest.index.categories_title')}</Text>
            <Text style={styles.sectionSubtitle}>{t('guest.index.categories_subtitle')}</Text>
            
            <View style={styles.gridContainer}>
              <View style={styles.gridRow}>{renderCategoryItem(categoryItems[0], 0)}</View>
              <View style={styles.gridRow}>
                {renderCategoryItem(categoryItems[1], 1)}
                {renderCategoryItem(categoryItems[2], 2)}
              </View>
              <View style={styles.gridRow}>
                {renderCategoryItem(categoryItems[3], 3)}
                {renderCategoryItem(categoryItems[4], 4)}
                {renderCategoryItem(categoryItems[5], 5)}
              </View>
            </View>
          </View>

          {/* How It Works Section */}
          <LinearGradient
            colors={['#FFF5F2', '#FFEBE8']}
            style={styles.howSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.howTitle}>{t('guest.index.how_title')}</Text>
            <View style={styles.stepsContainer}>
              <View style={styles.stepCard}>
                <LinearGradient
                  colors={['#FF6B35', '#FF4757']}
                  style={styles.stepNumber}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="search" size={24} color={COLORS.white} />
                </LinearGradient>
                <Text style={styles.stepTitle}>{t('guest.index.step_1_title')}</Text>
                <Text style={styles.stepSubtitle}>{t('guest.index.step_1_subtitle')}</Text>
              </View>
              
              <View style={styles.stepCard}>
                <LinearGradient
                  colors={['#FF6B35', '#FF4757']}
                  style={styles.stepNumber}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="calendar" size={24} color={COLORS.white} />
                </LinearGradient>
                <Text style={styles.stepTitle}>{t('guest.index.step_2_title')}</Text>
                <Text style={styles.stepSubtitle}>{t('guest.index.step_2_subtitle')}</Text>
              </View>
              
              <View style={styles.stepCard}>
                <LinearGradient
                  colors={['#FF6B35', '#FF4757']}
                  style={styles.stepNumber}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="checkmark-done" size={24} color={COLORS.white} />
                </LinearGradient>
                <Text style={styles.stepTitle}>{t('guest.index.step_3_title')}</Text>
                <Text style={styles.stepSubtitle}>{t('guest.index.step_3_subtitle')}</Text>
              </View>
              
              <View style={styles.stepCard}>
                <LinearGradient
                  colors={['#FF6B35', '#FF4757']}
                  style={styles.stepNumber}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="happy" size={24} color={COLORS.white} />
                </LinearGradient>
                <Text style={styles.stepTitle}>{t('guest.index.step_4_title')}</Text>
                <Text style={styles.stepSubtitle}>{t('guest.index.step_4_subtitle')}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Business CTA Section */}
          <View style={styles.ctaSection}>
            <LinearGradient
              colors={['#FF4757', '#E63946']}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.ctaIconWrapper}>
                <Ionicons name="storefront" size={48} color={COLORS.white} />
              </View>
              <Text style={styles.ctaTitle}>{t('guest.index.business_title')}</Text>
              <Text style={styles.ctaSubtitle}>{t('guest.index.business_subtitle')}</Text>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>{t('guest.index.cta_button')}</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={{ height: 40 }} />
        </Animated.ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  container: { flex: 1, backgroundColor: COLORS.white },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLogo: { width: 36, height: 36, resizeMode: 'contain',borderRadius:20 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },

  // Hero Section
  hero: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  heroLogo: { width: 70, height: 70, resizeMode: 'contain', marginBottom: 16,borderRadius:20 },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: '100%',
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.dark },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
    gap: 6,
  },
  locationText: { fontSize: 14, fontWeight: '600', color: COLORS.dark },

  // Banner
  bannerWrapper: {
    height: BANNER_HEIGHT,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject },
  bannerTextContainer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#f0f0f0',
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  indicatorWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  activeIndicator: { width: 24, backgroundColor: COLORS.white },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statNumber: { fontSize: 20, fontWeight: '800', color: COLORS.white, marginTop: 8, marginBottom: 4 },
  statLabel: { fontSize: 10, color: COLORS.white, textAlign: 'center', lineHeight: 14 },

  // What Section
  whatSection: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  whatHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  sparkle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatTitle: { fontSize: 20, fontWeight: '700', color: COLORS.dark, flex: 1 },
  whatText: {
    fontSize: 15,
    color: COLORS.gray,
    lineHeight: 24,
  },

  // Section
  section: { marginHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: COLORS.dark, marginBottom: 8 },
  sectionSubtitle: { fontSize: 14, color: COLORS.gray, marginBottom: 20 },

  // Hierarchical Grid Categories
  gridContainer: { gap: 12 },
  gridRow: { flexDirection: 'row', gap: 12 },
  categoryItem: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  largeItem: { flex: 1, height: 200 },
  mediumItem: { flex: 1, height: 160 },
  smallItem: { flex: 1, height: 140 },
  categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryOverlay: { ...StyleSheet.absoluteFillObject },
  categoryContent: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  categorySubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // How It Works
  howSection: {
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 20,
    padding: 20,
  },
  howTitle: { fontSize: 24, fontWeight: '800', color: COLORS.dark, marginBottom: 20 },
  stepsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12,width:'100%' },
  stepCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  stepNumber: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepTitle: { fontSize: 15, fontWeight: '700', color: COLORS.dark, marginBottom: 6, textAlign: 'center' },
  stepSubtitle: { fontSize: 12, color: COLORS.gray, textAlign: 'center', lineHeight: 18 },

  // CTA Section
  ctaSection: {
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  ctaGradient: {
    padding: 32,
    alignItems: 'center',
  },
  ctaIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 16,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 20,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  ctaButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});