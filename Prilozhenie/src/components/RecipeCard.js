import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

export default function RecipeCard({ recipe, onPress, style }) {
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
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>{recipe.time} мин</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>{recipe.calories} ккал</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="speedometer-outline" size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.medium,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.border,
  },
  content: {
    padding: 14,
  },
  title: {
    ...FONTS.subtitle,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...FONTS.caption,
  },
});
