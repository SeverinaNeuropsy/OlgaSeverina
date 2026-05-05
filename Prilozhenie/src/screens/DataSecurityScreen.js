import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../theme';

export default function DataSecurityScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.sc}>
        <Text style={styles.h}>Платежи и защита данных</Text>
        <Text style={styles.p}>
          Приложение устроено так, чтобы не собирать и не хранить реквизиты банковских карт. Оплата — безнал на расчётный счёт
          исполнителя, типичный для бизнеса в РБ, без ввода «номера карты в форму внутри экрана». Мошенники часто пользуются фишингом
          вокруг карт: здесь такого сценария нет, потому что полей для карты нет.{'\n\n'}
          Логины/имена/страна и внутренняя таблица учёта на устройстве (и экспортируемый CSV) — стандарт для вашей бухучёта, не
          публикуйте CSV в чатах. Не храните CSV с персоналиями в открытом доступе. Устройства защищайте PIN/биометрией.{'\n\n'}
          При дальнейшем подключении эквайринга или внешнего банка SDK следуйте PCI DSS и соглашайте обработку ПДн с
          оператором — это следующий этап, если появятся прямые карт-списания.{'\n\n'}
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
});
