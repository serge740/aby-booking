import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  ImageBackground,
  BackHandler,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';

interface Service {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  distance: string;
  isOpen: boolean;
  featured: boolean;
}

type CategoryType = 'all' | 'restaurants' | 'supermarkets' | 'salons' | 'services';

const AbyBookingHome: React.FC = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const { client } = useClientAuth();

  const services: Service[] = [
    {
      id: 1,
      name: 'Heaven Restaurant',
      category: 'restaurants',
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      distance: '1.2 km',
      isOpen: true,
      featured: true,
    },
    {
      id: 2,
      name: 'Simba Supermarket',
      category: 'supermarkets',
      rating: 4.5,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&q=80',
      distance: '0.8 km',
      isOpen: true,
      featured: true,
    },
    {
      id: 3,
      name: 'Elegance Hair Salon',
      category: 'salons',
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80',
      distance: '2.1 km',
      isOpen: true,
      featured: false,
    },
    {
      id: 4,
      name: 'Fresh Mart',
      category: 'supermarkets',
      rating: 4.6,
      reviews: 298,
      image: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80',
      distance: '1.5 km',
      isOpen: false,
      featured: false,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      const backAction = () => {
        Alert.alert(
          t('dashboard.exitApp.title') || 'Exit App',
          t('dashboard.exitApp.message') || 'Do you want to exit the app?',
          [
            {
              text: t('dashboard.exitApp.cancel') || 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: t('dashboard.exitApp.confirm') || 'Yes',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [t])
  );

  const displayServices =
    activeCategory === 'all'
      ? services
      : services.filter((s) => s.category === activeCategory);

  const categories = [
    {
      id: 'all',
      icon: 'grid',
      label: t('dashboard.index.categories.all'),
      color: '#FF6B35',
    },
    {
      id: 'restaurants',
      icon: 'restaurant',
      label: t('dashboard.index.categories.restaurants'),
      color: '#FF8C42',
    },
    {
      id: 'supermarkets',
      icon: 'cart',
      label: t('dashboard.index.categories.supermarkets'),
      color: '#FFA94D',
    },
    {
      id: 'salons',
      icon: 'cut',
      label: t('dashboard.index.categories.salons'),
      color: '#FFB366',
    },
    {
      id: 'services',
      icon: 'construct',
      label: t('dashboard.index.categories.services'),
      color: '#FF8566',
    },
  ];

  const quickActions = [
    {
      icon: 'fast-food',
      label: t('dashboard.index.quick_actions.order_food'),
      color: '#FF6B35',
      bgColor: '#FF6B3515',
    },
    {
      icon: 'calendar',
      label: t('dashboard.index.quick_actions.book_service'),
      color: '#FF4757',
      bgColor: '#FF475715',
    },
    {
      icon: 'bag-handle',
      label: t('dashboard.index.quick_actions.shop_now'),
      color: '#FF8C42',
      bgColor: '#FF8C4215',
    },
    {
      icon: 'star',
      label: t('dashboard.index.quick_actions.favorites'),
      color: '#FFA94D',
      bgColor: '#FFA94D15',
    },
  ];

  const renderServiceCard = (service: Service) => (
    <TouchableOpacity key={service.id} style={styles.serviceCard}>
      <ImageBackground
        source={{ uri: service.image }}
        style={styles.serviceImage}
        imageStyle={styles.serviceImageStyle}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          style={styles.serviceImageGradient}
        >
          {service.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color="#FFF" />
              <Text style={styles.featuredText}>{t('dashboard.index.featured')}</Text>
            </View>
          )}
          
          <View style={styles.serviceImageContent}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <View style={styles.serviceMetaRow}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{service.rating}</Text>
                  <Text style={styles.reviewsText}>({service.reviews})</Text>
                </View>
                <View style={styles.distanceContainer}>
                  <Ionicons name="location" size={12} color="#FFF" />
                  <Text style={styles.distanceText}>{service.distance}</Text>
                </View>
              </View>
            </View>
            
            <View
              style={[
                styles.statusBadge,
                service.isOpen ? styles.statusOpen : styles.statusClosed,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  service.isOpen ? styles.statusDotOpen : styles.statusDotClosed,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  service.isOpen ? styles.statusTextOpen : styles.statusTextClosed,
                ]}
              >
                {service.isOpen
                  ? t('dashboard.index.status.open')
                  : t('dashboard.index.status.closed')}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#FF6B35', '#FF4757']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <LinearGradient
                colors={['#fff', '#ffe0d9']}
                style={styles.avatarContainer}
              >
                <Ionicons name="person" size={22} color="#FF6B35" />
              </LinearGradient>
              <View>
                <Text style={styles.welcomeText}>{t('dashboard.index.welcome')}</Text>
                <Text style={styles.userName}>{client?.name || 'Guest'}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart-outline" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={22} color="#FFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>5</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              placeholder={t('dashboard.index.search_placeholder')}
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#FFF" />
            <Text style={styles.locationText}>{t('dashboard.index.location')}</Text>
            <Ionicons name="chevron-down" size={16} color="#FFF" />
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.bgColor }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800&q=80' }}
            style={styles.promoImage}
            imageStyle={{ borderRadius: 16 }}
          >
            <LinearGradient
              colors={['rgba(255,107,53,0.95)', 'rgba(255,71,87,0.95)']}
              style={styles.promoGradient}
            >
              <View style={styles.promoContent}>
                <View style={styles.promoIconContainer}>
                  <Ionicons name="gift" size={36} color="#FFF" />
                </View>
                <View style={styles.promoText}>
                  <Text style={styles.promoTitle}>{t('dashboard.index.promo_title')}</Text>
                  <Text style={styles.promoSubtitle}>{t('dashboard.index.promo_subtitle')}</Text>
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>{t('dashboard.index.promo_button')}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FF6B35" />
                </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>{t('dashboard.index.browse_categories')}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  activeCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setActiveCategory(category.id as CategoryType)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={18}
                  color={activeCategory === category.id ? '#FFF' : category.color}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    activeCategory === category.id && styles.categoryChipTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured/Popular Services */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.index.section_title')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('dashboard.index.see_all')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.servicesGrid}>
            {displayServices.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="business-outline" size={64} color="#D1D5DB" />
                </View>
                <Text style={styles.emptyTitle}>{t('dashboard.index.empty.no_services')}</Text>
                <Text style={styles.emptyText}>
                  {t('dashboard.index.empty.try_different')}
                </Text>
              </View>
            ) : (
              displayServices.map(renderServiceCard)
            )}
          </View>
        </View>

     
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={['#FF6B35', '#FF4757']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="chatbubbles" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  welcomeText: { color: '#ffe0d9', fontSize: 14, fontWeight: '500' },
  userName: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#10B981', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FF6B35' },
  notificationText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#1F2937', fontSize: 15 },
  filterButton: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FF6B3510', alignItems: 'center', justifyContent: 'center' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  quickActionsSection: { paddingHorizontal: 20, marginTop: 20 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickActionCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  quickActionIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  quickActionLabel: { color: '#1F2937', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  promoBanner: { marginHorizontal: 20, marginVertical: 24, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  promoImage: { height: 140 },
  promoGradient: { flex: 1, justifyContent: 'center' },
  promoContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 16 },
  promoIconContainer: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  promoText: { flex: 1,alignItems: 'flex-start', },
  promoTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  promoSubtitle: { color: 'rgba(255,255,255,0.95)', fontSize: 13 },
  promoButton: { flexDirection: 'row', alignItems: 'center', gap: 6,  marginTop: 6 ,backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  promoButtonText: { color: '#FF6B35', fontSize: 14, fontWeight: '700' },
  categoriesSection: { paddingVertical: 20 ,paddingHorizontal: 20, },
  categoriesScroll: { paddingHorizontal: 20, gap: 10 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#F3F4F6' },
  categoryChipActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  categoryChipText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  categoryChipTextActive: { color: '#FFF' },
  servicesSection: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  seeAllText: { color: '#FF6B35', fontSize: 14, fontWeight: '600' },
  servicesGrid: { gap: 12 },
  serviceCard: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  serviceImage: { height: 180 },
  serviceImageStyle: { borderRadius: 16 },
  serviceImageGradient: { flex: 1, justifyContent: 'space-between', padding: 16 },
  featuredBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FF6B35', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, alignSelf: 'flex-start' },
  featuredText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  serviceImageContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  serviceInfo: { flex: 1 },
  serviceName: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 6, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  serviceMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  reviewsText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  distanceContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  distanceText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusOpen: { backgroundColor: 'rgba(16, 185, 129, 0.95)' },
  statusClosed: { backgroundColor: 'rgba(156, 163, 175, 0.95)' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusDotOpen: { backgroundColor: '#FFF' },
  statusDotClosed: { backgroundColor: '#FFF' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextOpen: { color: '#FFF' },
  statusTextClosed: { color: '#FFF' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, backgroundColor: '#F9FAFB', borderRadius: 20, marginTop: 20 },
  emptyIconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 },
  infoSection: { paddingHorizontal: 20, marginBottom: 40 },
  infoCard: { borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  infoTitle: { color: '#FFF', fontSize: 22, fontWeight: '700', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  infoText: { color: 'rgba(255,255,255,0.95)', fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  infoButton: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  infoButtonText: { color: '#FF6B35', fontSize: 15, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});

export default AbyBookingHome;