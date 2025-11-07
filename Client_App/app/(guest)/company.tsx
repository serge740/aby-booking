/* eslint-disable no-dupe-keys */
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

/* ────────────────────────────────────────
   COLORS – add `success` (or any other you need)
   ──────────────────────────────────────── */
import { COLORS as RAW_COLORS } from '../../constants/colors';

// Extend the imported colours with the missing `success`
const COLORS = {
  ...RAW_COLORS,
  success: '#10B981', // <-- change to your real success colour
};

/* ────────────────────────────────────────
   BUSINESS DATA
   ──────────────────────────────────────── */
const businesses = [
  {
    id: 1,
    name: 'Chicken Burger Spicy',
    category: 'Burger Nglier',
    distance: '1.4km',
    price: 34000,
    rating: 4.9,
    freeDelivery: true,
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Fresh Shusi Bowl',
    category: 'Sushi Toi',
    distance: '4.2km',
    price: 151000,
    rating: 4.5,
    freeDelivery: true,
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Question Coffee Café',
    category: 'Coffee Shop',
    distance: '2.1km',
    price: 25000,
    rating: 4.7,
    freeDelivery: false,
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Simba Supermarket',
    category: 'Supermarket',
    distance: '0.8km',
    price: 0,
    rating: 4.8,
    freeDelivery: true,
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
  },
];

/* ────────────────────────────────────────
   HEADER (inside file)
   ──────────────────────────────────────── */
const HEADER_CONTENT_HEIGHT = 80;
const STATUS_BAR_HEIGHT = Platform.select({
  ios: 50,
  android: StatusBar.currentHeight ?? 0,
});

const Header = ({
  greeting = 'Hello, Guest!',
  subMessage = 'Discover local businesses',
}: {
  greeting?: string;
  subMessage?: string;
}) => (
  <View style={headerStyles.wrapper}>
    <View style={headerStyles.statusBar} />
    <View style={headerStyles.content}>
      <Text style={headerStyles.greeting}>{greeting}</Text>
      <Text style={headerStyles.subMessage}>{subMessage}</Text>
    </View>
  </View>
);

const headerStyles = StyleSheet.create({
  wrapper: { backgroundColor: COLORS.primary },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: COLORS.primary,
  },
  content: {
    height: HEADER_CONTENT_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  subMessage: {
    fontSize: 15,
    color: COLORS.white,
    opacity: 0.95,
  },
});

/* ────────────────────────────────────────
   MAIN SCREEN
   ──────────────────────────────────────── */
export default function Companies() {
  const { t } = useTranslation();

  const handleAddToCart = (item: typeof businesses[0]) => {
    console.log('Added to cart:', item.name);
    // TODO: connect to your cart store
  };

  const renderItem = ({ item }: { item: typeof businesses[0] }) => (
    <View style={styles.card}>
      {/* Top badges */}
      <View style={styles.topRow}>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingIcon}>Star</Text>
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>

        {item.freeDelivery && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeIcon}>Truck</Text>
            <Text style={styles.freeText}>Free</Text>
          </View>
        )}
      </View>

      {/* Image */}
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {item.name}
      </Text>

      {/* Price */}
      <Text style={styles.price}>
        IDR {item.price.toLocaleString('id-ID')}
      </Text>

      {/* Restaurant + distance */}
      <View style={styles.footer}>
        <Text style={styles.restaurant}>
          {item.category} • {item.distance}
        </Text>
      </View>

      {/* Add to Cart */}
      <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <Header
          greeting={t('guest.header.greeting', 'Hello, Guest!')}
          subMessage={t('guest.header.subMessage', 'Discover local businesses')}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Offers</Text>

            <FlatList
              data={businesses}
              keyExtractor={(i) => i.id.toString()}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* ────────────────────────────────────────
   STYLES
   ──────────────────────────────────────── */
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16 px side padding + 16 px gap

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    backgroundColor: COLORS.white,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* Section */
  section: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 16,
  },

  /* Grid */
  listContainer: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },

  /* Card */
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingIcon: { fontSize: 14, marginRight: 4 },
  ratingText: { fontSize: 13, fontWeight: '600', color: COLORS.dark },

  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success, // now typed!
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeIcon: { fontSize: 14, marginRight: 4, color: '#fff' },
  freeText: { fontSize: 12, fontWeight: '600', color: '#fff' },

  image: {
    width: '100%',
    height: 140,
  },

  title: {
    marginTop: 12,
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
  },

  price: {
    marginTop: 4,
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  footer: {
    marginTop: 4,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  restaurant: {
    fontSize: 12,
    color: '#6B7280',
  },

  addButton: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});