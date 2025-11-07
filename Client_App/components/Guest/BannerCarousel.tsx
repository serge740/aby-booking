import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

export interface BannerItem {
  id: number;
  image: any;               // require('../../assets/...')
  title: string;
  description: string;
}

interface BannerCarouselProps {
  data: BannerItem[];
  autoPlayInterval?: number;   // ms
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  data,
  autoPlayInterval = 4000,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // ───── Auto-play ─────
  useEffect(() => {
    const id = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        const next = (activeSlide + 1) % data.length;
        flatListRef.current?.scrollToOffset({
          offset: next * width,
          animated: true,
        });
        setActiveSlide(next);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, autoPlayInterval);

    return () => clearInterval(id);
  }, [activeSlide, data.length, autoPlayInterval, fadeAnim]);

  const renderItem = ({ item }: { item: BannerItem }) => (
    <View style={{ width }}>
      <Image source={item.image} style={styles.bannerImg} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View style={[styles.bannerTxt, { opacity: fadeAnim }]}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerDescription}>{item.description}</Text>
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.bannerContainer}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={i => i.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveSlide(newIndex);
        }}
      />
      {/* Dots */}
      <View style={styles.bannerDots}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeSlide && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

/* ───── Styles (only banner) ───── */
const styles = StyleSheet.create({
  bannerContainer: {
    height: BANNER_HEIGHT,
    marginHorizontal: 4,
    marginTop: 10,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  bannerImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerTxt: { position: 'absolute', bottom: 24, left: 24, right: 24 },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  bannerDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.95,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  activeDot: { width: 24, backgroundColor: COLORS.white },
});