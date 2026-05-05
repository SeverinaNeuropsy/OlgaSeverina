import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

export default function CategoryCard({ category, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: category.color + '20' }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={category.icon} size={32} color={category.color} />
      <Text style={styles.title}>{category.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
    gap: 8,
  },
  title: {
    ...FONTS.body,
    fontWeight: '600',
    textAlign: 'center',
  },
});
