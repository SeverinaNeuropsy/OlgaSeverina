import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../theme';

export default function SafetyScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.sc}>
        <Text style={styles.h}>Правила безопасности для родителей</Text>
        <Text style={styles.p}>
          • Массаж, гимнастика, вода, фитбол, прыжки, бег, лазанья — всегда с присмотром взрослого, в соответствии с
          весом, врачом, ЛФК. Не доверяйте движок «на автопилоте».{'\n\n'}
          • В ванне: не оставляйте малыша без прямой опоры, одного уровня со скольжением, горячей водой.{'\n\n'}
          • Плавание в домашней ванне — не погружение с задержкой дыхания и не «ныряние взрослого метода» без сертифицированного
          инструктора.{'\n\n'}
          • Симптомы, которые тревожат (спазмы, вялость, асимметрия, странный плач, одышка, лихорадка, сильная аллергия) — врач, не
          совет из приложения.{'\n\n'}
          • Материал приложения — справка; ответственность за решения, безопасность, обращение в клинику — на семье.{'\n\n'}
          • Сон: безопасный матрас, положение на спине для младенца рекомендовано педиатрами, избегайте перегрева, лишних
          мягких бортов.{'\n\n'}
        </Text>
        <Text style={styles.foot}>
          Согласуется с благоразумием и с медицинскими нормами, которые вам дал лечащий врач.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  sc: { padding: SIZES.padding, paddingBottom: 40 },
  h: { ...FONTS.title, marginBottom: 12 },
  p: { ...FONTS.body, lineHeight: 24 },
  foot: { ...FONTS.caption, color: COLORS.textLight, fontStyle: 'italic', marginTop: 8 },
});
