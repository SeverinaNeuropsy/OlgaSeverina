import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

export default function VideoBlock({ title, url, note }) {
  if (!url) {
    return (
      <View style={styles.ph}>
        <Text style={styles.phTitle}>{title}</Text>
        <Text style={styles.phText}>
          {note || 'Видео-урок подготовит Клуб «Мама-Супер!» (Минск) и появится в обновлении. Пока ориентируйтесь на текстовую часть и консультации специалистов.'}
        </Text>
      </View>
    );
  }

  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');

  return (
    <View style={styles.wrap}>
      <Text style={styles.h}>{title}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <View style={styles.videoWrap}>
        <Video
          style={styles.videoIn}
          source={{ uri: url }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          if (isYoutube) {
            const m = /embed\/([^?&]+)/.exec(url);
            const id = m && m[1] ? m[1] : '';
            if (id) {
              Linking.openURL(`https://www.youtube.com/watch?v=${id}`);
              return;
            }
          }
          Linking.openURL(url);
        }}
        style={styles.out}
      >
        <Text style={styles.outText}>{isYoutube ? 'Открыть в YouTube' : 'Открыть видеофайл'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 18, ...SHADOWS.light, borderRadius: SIZES.radius, overflow: 'hidden' },
  h: { ...FONTS.subtitle, marginBottom: 6, paddingHorizontal: SIZES.padding },
  note: { ...FONTS.caption, marginBottom: 6, paddingHorizontal: SIZES.padding },
  videoWrap: { height: 220, width: '100%', backgroundColor: '#000' },
  videoIn: { flex: 1 },
  out: { padding: 10, alignItems: 'center' },
  outText: { ...FONTS.caption, color: COLORS.primaryDeep, textDecorationLine: 'underline' },
  ph: {
    padding: 14,
    backgroundColor: COLORS.cream,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  phTitle: { ...FONTS.subtitle, marginBottom: 6 },
  phText: { ...FONTS.caption, color: COLORS.text },
});
