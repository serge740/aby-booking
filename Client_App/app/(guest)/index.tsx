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
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import info from '@/constants/info';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

export default function HomeScreen() {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const textAnim = useRef(new Animated.Value(0)).current;

  // Banner data with images only (text from i18n)
  const bannerData = [
    { id: 1, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80' },
    { id: 2, image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&q=80' },
    { id: 3, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80' },
    { id: 4, image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80' },
  ];

  const categoryItems = [
    { id: 1, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', size: 'large', icon: 'restaurant' },
    { id: 2, image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&q=80', size: 'medium', icon: 'cart' },
    { id: 3, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&q=80', size: 'medium', icon: 'cut' },
    { id: 4, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80', size: 'small', icon: 'phone-portrait' },
    { id: 5, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80', size: 'small', icon: 'shirt' },
    { id: 6, image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=300&q=80', size: 'small', icon: 'home' },
  ];

  const bannerTexts = t('guest.index.banner', { returnObjects: true }) as Array<{ title: string; subtitle: string }>;
  const categoryTexts = t('guest.index.categories', { returnObjects: true }) as Array<{ title: string; subtitle: string }>;

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

  const renderBannerItem = ({ item, index }: { item: typeof bannerData[0]; index: number }) => {
    const { title, subtitle } = bannerTexts[index];

    return (
      <View style={{ width }}>
        <Image source={{ uri: item.image }} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />

        <Animated.View style={[styles.bannerTextContainer, { transform: [{ translateX: textAnim }] }]}>
          <Text style={styles.bannerTitle}>{title}</Text>
          <Text style={styles.bannerSubtitle}>{subtitle}</Text>
        </Animated.View>
      </View>
    );
  };

  const renderCategoryItem = (item: typeof categoryItems[0], textIndex: number) => {
    const { title, subtitle } = categoryTexts[textIndex];
    const itemStyle = item.size === 'large' 
      ? styles.largeItem 
      : item.size === 'medium' 
      ? styles.mediumItem 
      : styles.smallItem;

    return (
      <TouchableOpacity key={item.id} style={[styles.categoryItem, itemStyle]}>
        <Image source={{ uri: item.image }} style={styles.categoryImage} />
        <View style={styles.categoryOverlay} />
        <View style={styles.categoryContent}>
          <View style={styles.iconCircle}>
            <Ionicons name={item.icon as any} size={20} color="#fff" />
          </View>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.categorySubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const stats = t('guest.index.stats', { returnObjects: true }) as { businesses: string; customers: string; orders: string };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Image source={require('../../assets/logo/aby_booking.png')} style={styles.logoImage} />
              <View style={styles.textContainer}>
                <Text style={styles.logo}>{t('guest.index.app_name')}</Text>
                <Text style={styles.logoSubtext}>{t('guest.index.app_subtitle')}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Location Bar */}
          <View style={styles.locationBar}>
            <Ionicons name="location" size={20} color={info.primary[600]} />
            <Text style={styles.locationText}>{t('guest.index.location')}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </View>

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

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.businesses.split(' ')[0]}</Text>
              <Text style={styles.statLabel}>{stats.businesses.split(' ').slice(1).join(' ')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.customers.split(' ')[0]}</Text>
              <Text style={styles.statLabel}>{stats.customers.split(' ').slice(1).join(' ')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.orders.split(' ')[0]}</Text>
              <Text style={styles.statLabel}>{stats.orders.split(' ').slice(1).join(' ')}</Text>
            </View>
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('guest.index.section_title')}</Text>
            <Text style={styles.sectionSubtitle}>{t('guest.index.section_subtitle')}</Text>
          </View>

          {/* Hierarchical Grid */}
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

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <View style={styles.ctaContent}>
              <Ionicons name="storefront" size={40} color={info.primary[600]} />
              <Text style={styles.ctaTitle}>{t('guest.index.cta_title')}</Text>
              <Text style={styles.ctaSubtitle}>{t('guest.index.cta_subtitle')}</Text>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>{t('guest.index.cta_button')}</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* ------------------------------------------------------------------ */
/* Styles – unchanged                                                 */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: info.primary[500] },
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
  },
  textContainer: { justifyContent: 'center' },
  logo: { fontSize: 22, fontWeight: '700', color: info.primary[500] },
  logoSubtext: { fontSize: 12, color: '#666', marginTop: 2 },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  bannerWrapper: {
    height: BANNER_HEIGHT,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  bannerTextContainer: { position: 'absolute', bottom: 24, left: 20, right: 20 },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
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
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  activeIndicator: { width: 24, backgroundColor: '#fff' },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '700', color: info.primary[500] },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: '#e0e0e0', marginHorizontal: 8 },
  sectionHeader: { paddingHorizontal: 16, marginTop: 32, marginBottom: 16 },
  sectionTitle: { fontSize: 24, fontWeight: '700', color: info.primary[500] },
  sectionSubtitle: { fontSize: 14, color: '#666', marginTop: 6 },
  gridContainer: { paddingHorizontal: 16, gap: 12 },
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
  categoryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  categoryContent: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: info.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#f0f0f0',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ctaSection: {
    marginHorizontal: 16,
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  ctaContent: { alignItems: 'center' },
  ctaTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 16, textAlign: 'center' },
  ctaSubtitle: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center', lineHeight: 20 },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: info.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
    gap: 8,
  },
  ctaButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});