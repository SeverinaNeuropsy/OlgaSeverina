import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

export default function RecipeCardSmall({ recipe, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{recipe.time} мин</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusSmall,
    overflow: 'hidden',
    width: 160,
    ...SHADOWS.light,
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: COLORS.border,
  },
  content: {
    padding: 10,
  },
  title: {
    ...FONTS.caption,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...FONTS.small,
  },
});
