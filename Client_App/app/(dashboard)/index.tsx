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
  BackHandler,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import ThemedView from '@/components/themed/ThemedView';

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
  description: string;
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
      description: 'Fine Dining',
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
      description: 'Fresh Groceries',
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
      description: 'Beauty & Style',
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
      description: 'Organic Products',
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
      label: t('dashboard.index.categories.all'),
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80',
    },
    {
      id: 'restaurants',
      label: t('dashboard.index.categories.restaurants'),
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80',
    },
    {
      id: 'supermarkets',
      label: t('dashboard.index.categories.supermarkets'),
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&q=80',
    },
    {
      id: 'salons',
      label: t('dashboard.index.categories.salons'),
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&q=80',
    },
    {
      id: 'services',
      label: t('dashboard.index.categories.services'),
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&q=80',
    },
  ];

  const renderServiceCard = (service: Service) => (
    <View key={service.id} style={styles.serviceCard}>
      <Image source={{ uri: service.image }} style={styles.serviceImage} />
      <View style={styles.serviceContent}>
        <Text style={styles.serviceName} numberOfLines={1}>{service.name}</Text>
        <Text style={styles.serviceDescription} numberOfLines={1}>{service.description}</Text>
        <View style={styles.serviceFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.ratingText}>{service.rating}</Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView safe style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#FF6B35" />
            <Text style={styles.locationLabel}>Location</Text>
          </View>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>Kigali, Rwanda</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoTextSection}>
              <Text style={styles.promoTitle}>Special Offer</Text>
              <Text style={styles.promoDiscount}>25% OFF</Text>
              <Text style={styles.promoDate}>Nov 7 - Dec 7</Text>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Join Now</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80' }}
              style={styles.promoImage}
            />
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  activeCategory === category.id && styles.categoryCardActive,
                ]}
                onPress={() => setActiveCategory(category.id as CategoryType)}
              >
                <View style={[
                  styles.categoryImageContainer,
                  activeCategory === category.id && styles.categoryImageActive
                ]}>
                  <Image 
                    source={{ uri: category.image }} 
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={[
                  styles.categoryLabel,
                  activeCategory === category.id && styles.categoryLabelActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {displayServices.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No services found</Text>
              <Text style={styles.emptyText}>Try a different category</Text>
            </View>
          ) : (
            <View style={styles.servicesGrid}>
              {displayServices.map(renderServiceCard)}
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  scrollView: {
    flex: 1,
  },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#F8F9FA',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  locationLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#333' 
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  promoBanner: { 
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FF8C42',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  promoContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  promoTextSection: {
    flex: 1,
  },
  promoTitle: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: '700',
    marginBottom: 4,
  },
  promoDiscount: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: '800',
    marginBottom: 4,
  },
  promoDate: { 
    color: 'rgba(255,255,255,0.9)', 
    fontSize: 13,
    marginBottom: 12,
  },
  promoButton: { 
    backgroundColor: '#FFF', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: { 
    color: '#FF8C42', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  promoImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  categoriesSection: { 
    marginBottom: 24,
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#333' 
  },
  seeAllText: { 
    color: '#FF6B35', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  categoriesScroll: { 
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryCard: { 
    alignItems: 'center',
    gap: 8,
  },
  categoryImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  categoryImageActive: {
    borderColor: '#FF6B35',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: { 
    color: '#666', 
    fontSize: 12, 
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#FF6B35',
  },
  servicesSection: { 
    paddingBottom: 40,
  },
  servicesGrid: { 
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: { 
    width: '48%',
    backgroundColor: '#FFF', 
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceImage: { 
    width: '100%',
    height: 140,
    backgroundColor: '#F0F0F0',
  },
  serviceContent: {
    padding: 12,
  },
  serviceName: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: { 
    fontSize: 12, 
    color: '#999',
    marginBottom: 8,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
  },
  ratingText: { 
    color: '#333', 
    fontSize: 13, 
    fontWeight: '600' 
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: { 
    fontSize: 14, 
    color: '#999',
    textAlign: 'center',
  },
});

export default AbyBookingHome;