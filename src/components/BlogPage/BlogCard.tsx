import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SansText } from '../reusable/Text/SansText';
import { SatoshiText } from '../reusable/Text/SatoshiText';

const { width } = Dimensions.get('window');

type Props = {
  title: string;
  category?: string;
  blogType?: 'article' | 'video' | 'podcast' | 'guide';
  thumbnail: any;
  onPress?: () => void;
  date?: string;
};

const BlogCard = ({
  title,
  category,
  blogType = 'article',
  thumbnail,
  onPress,
  date,
}: Props) => {
  const getBlogTypeInfo = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      article: { label: 'Article', color: '#4CAF50' },
      video: { label: 'Video', color: '#FF6B6B' },
      podcast: { label: 'Podcast', color: '#9C27B0' },
      guide: { label: 'Guide', color: '#2196F3' },
    };
    return types[type] || types.article;
  };

  const typeInfo = getBlogTypeInfo(blogType);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Image */}
      <Image source={thumbnail} style={styles.image} resizeMode="cover" />

      {/* Content */}
      <View style={styles.content}>
        {/* Category & Type Row */}
        <View style={styles.topRow}>
          {category && (
            <View style={styles.categoryBadge}>
              <SansText style={styles.categoryText}>{category}</SansText>
            </View>
          )}
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: typeInfo.color + '15' },
            ]}
          >
            <SansText style={[styles.typeText, { color: typeInfo.color }]}>
              {typeInfo.label}
            </SansText>
          </View>
        </View>

        {/* Title */}
        <SatoshiText style={styles.title} numberOfLines={2}>
          {title}
        </SatoshiText>

        {/* Date & CTA Row */}
        <View style={styles.bottomRow}>
          {date && <SansText style={styles.dateText}>{date}</SansText>}
          <SansText style={styles.cta}>Read More →</SansText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BlogCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
    width: width - 32,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0F0F0',
  },
  content: {
    padding: 14,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.10)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    color: '#D4AF37',
    fontFamily: 'Satoshi-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontFamily: 'Satoshi-Medium',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#8E8E93',
    fontFamily: 'Satoshi-Regular',
  },
  cta: {
    fontSize: 12,
    color: '#D4AF37',
    fontFamily: 'Satoshi-Medium',
  },
});
