/* eslint-disable react/jsx-no-undef */
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageRequireSource,
} from 'react-native';
import { COLORS } from '../../constants/colors';

// ── NEW TYPE (image + title only) ───────────────────────────────
export interface CategoryItem {
  id: string | number;
  title: string;
  imageUrl: ImageRequireSource;
}

interface FeaturedCategoriesProps {
  data: CategoryItem[];
  onPress?: (item: CategoryItem) => void;
  spacing?: number;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  data,
  onPress,
  spacing = 12,
}) => {
  const renderItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.item, { marginHorizontal: spacing / 2 }]}
      onPress={() => onPress?.(item)}
    >
      {/* SQUARE IMAGE CONTAINER */}
      <View style={styles.iconContainer}>
        <Image source={item.imageUrl} style={styles.imageIcon} />
      </View>

      <Text style={styles.label} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={i => i.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
};

/* ────────────────────── STYLES ────────────────────── */
const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  item: {
    alignItems: 'center',
    width: 120,               // fixed width → predictable spacing
  },

  // SQUARE CONTAINER (120 × 120)
  iconContainer: {
    width: 120,
    height: 95,
    borderRadius: 16,         // optional soft corners
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // IMAGE FILLS THE SQUARE (centered, no stretch)
  imageIcon: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },

  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});