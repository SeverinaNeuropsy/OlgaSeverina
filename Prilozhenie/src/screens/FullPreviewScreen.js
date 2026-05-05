import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurriculum } from '../data/curriculum/data6m';
import { AGE_GROUPS } from '../data/ageGroups';
import { COLORS, FONTS, SHADOWS, SIZES } from '../theme';

function Bullet({ children }) {
  return <Text style={styles.p}>• {children}</Text>;
}

function AgeBlock({ age }) {
  const data = getCurriculum(age.id);
  if (!data) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.ageTitle}>{age.label}</Text>

      <Text style={styles.h2}>Развитие и нормы</Text>
      <Text style={styles.p}>{data.development.intro}</Text>
      {data.development.norms.map((n, i) => (
        <Bullet key={`dev-${age.id}-${i}`}>
          {n.skill} — {n.period}
        </Bullet>
      ))}

      <Text style={styles.h2}>Массаж и гимнастика</Text>
      <Text style={styles.p}>{data.massage.intro}</Text>
      {data.massage.subsections.map((s, i) => (
        <Bullet key={`m-${age.id}-${i}`}>
          {s.name}: {s.text}
        </Bullet>
      ))}
      {data.massage.videos?.map((v, i) => (
        <Bullet key={`mv-${age.id}-${i}`}>Видео: {v.title}</Bullet>
      ))}

      <Text style={styles.h2}>Плавание в домашней ванне</Text>
      <Text style={styles.p}>{data.swim.intro}</Text>
      <Text style={styles.p}>{data.swim.safety}</Text>
      {data.swim.videos?.map((v, i) => (
        <Bullet key={`sv-${age.id}-${i}`}>Видео: {v.title}</Bullet>
      ))}

      <Text style={styles.h2}>Развитие речи</Text>
      <Text style={styles.p}>{data.speech.intro}</Text>
      {data.speech.momExercises.map((e, i) => (
        <Bullet key={`sp-${age.id}-${i}`}>{e}</Bullet>
      ))}

      <Text style={styles.h2}>Режим, кормления, сон</Text>
      <Text style={styles.p}>{data.life.intro}</Text>
      {data.life.sections.map((s, i) => (
        <Bullet key={`life-${age.id}-${i}`}>
          {s.h}: {s.body}
        </Bullet>
      ))}

      <Text style={styles.h2}>Нервная система и мозг</Text>
      <Text style={styles.p}>{data.brain.intro}</Text>
      {data.brain.points.map((p, i) => (
        <Bullet key={`b-${age.id}-${i}`}>{p}</Bullet>
      ))}
    </View>
  );
}

export default function FullPreviewScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.sc}>
        <Text style={styles.h1}>Полный просмотр всех разделов</Text>
        <Text style={styles.caption}>
          Этот экран показывает весь контент приложения без подписки: возраст 1–3 и 3–6 месяцев.
        </Text>
        {AGE_GROUPS.map((age) => (
          <AgeBlock key={age.id} age={age} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  sc: { padding: SIZES.padding, paddingBottom: 36 },
  h1: { ...FONTS.title, marginBottom: 8 },
  caption: { ...FONTS.caption, marginBottom: 12, color: COLORS.textLight },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  ageTitle: { ...FONTS.subtitle, color: COLORS.primaryDeep, marginBottom: 6 },
  h2: { ...FONTS.subtitle, fontSize: 16, marginTop: 10, marginBottom: 4 },
  p: { ...FONTS.body, marginBottom: 4 },
});
