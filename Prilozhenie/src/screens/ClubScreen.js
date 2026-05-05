import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

export default function ClubScreen() {
  const open = (url) => Linking.openURL(url);
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.sc}>
        <Text style={styles.h}>Клуб «Мама-Супер!»</Text>
        <Text style={styles.p}>
          Клуб в Минске (Республика Беларусь) объединяет специалистов по нейропсихологии, развитию, консультациям для семей. В приложении
          использованы смыслы и подходы, согласованные с руководителем и командой. Тексты о развитии мозга и способностей можно
          уточнять по материалам Instagram клуба.
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => open('https://www.instagram.com/klubmamasuper/')}
        >
          <Text style={styles.btnT}>Instagram: @klubmamasuper</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn2}
          onPress={() => open('https://www.instagram.com/severina.neuropsy/')}
        >
          <Text style={styles.btn2T}>Нейро-психолог: @severina.neuropsy</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.c}>
            Клуб создаёт вовлекающие, бережные тексты. Приложение — информационный продукт, не курс лечения. Обсудите вопросы
            сомнения с профильными врачами.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  sc: { padding: SIZES.padding, paddingBottom: 40 },
  h: { ...FONTS.title, marginBottom: 10 },
  p: { ...FONTS.body, marginBottom: 14, lineHeight: 22 },
  btn: { backgroundColor: COLORS.primaryDeep, padding: 14, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: 10 },
  btnT: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btn2: { backgroundColor: COLORS.secondary, padding: 14, borderRadius: SIZES.radius, alignItems: 'center', marginBottom: 10 },
  btn2T: { color: '#fff', fontSize: 16, fontWeight: '600' },
  card: { backgroundColor: COLORS.surface, padding: 14, borderRadius: SIZES.radius, ...SHADOWS.light, borderWidth: 1, borderColor: COLORS.border },
  c: { ...FONTS.caption, lineHeight: 20, color: COLORS.textLight },
});
