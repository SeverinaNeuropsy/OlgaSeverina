export const COLORS = {
  primary: '#C9A8C0',
  primaryDeep: '#A67F9A',
  secondary: '#8FB8A8',
  secondaryLight: '#B5D4C5',
  accent: '#E8C4A8',
  accentPeach: '#F5D5C8',
  background: '#FDF6F3',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#4A4454',
  textLight: '#6D6570',
  textMuted: '#9A9299',
  border: '#EEE4EC',
  divider: '#F0E8F0',
  cream: '#FFF5EF',
  danger: '#C97B7B',
  white: '#FFFFFF',
  overlay: 'rgba(74, 68, 84, 0.45)',
};

export const FONTS = {
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 15, fontWeight: '400', color: COLORS.text, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400', color: COLORS.textLight, lineHeight: 19 },
  small: { fontSize: 11, fontWeight: '400', color: COLORS.textMuted },
};

export const SIZES = {
  padding: 16,
  paddingSmall: 10,
  paddingLarge: 24,
  radius: 18,
  radiusSmall: 12,
  radiusLarge: 26,
  iconSize: 24,
};

export const SHADOWS = {
  light: {
    shadowColor: '#4A4454',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#4A4454',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};
