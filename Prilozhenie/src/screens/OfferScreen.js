import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../theme';

export default function OfferScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.sc}>
        <Text style={styles.h}>Публичная оферта (сокращённо)</Text>
        <Text style={styles.p}>
          1. Исполнитель: частное предприятие, учёт в соответствии с реквизитами в разделе подписки.{'\n\n'}
          2. Предмет: предоставление доступа к цифровому информационному продукту (контент приложения) на срок, оплаченный подписчиком, по
          модели с автоматическим ожидаемым продлением при очередных безналичных оплатах на те же реквизиты, если подписчик не
          уведомил об отказе.{'\n\n'}
          3. Стоимость: эквивалент 29 (двадцати девяти) долларов США в месяц, или 9 (девяти) долларов США за первую неделю, если
          выбран такой путь; конвертация в валюту счёта плательщика по курсу банка.{'\n\n'}
          4. Оплата: безнал на указанные реквизиты, без приёма карт внутри приложения.{'\n\n'}
          5. Акцепт: регистрация в приложении и/или внесение оплаты.{'\n\n'}
          6. Возвраты: в соответствии с применимым правом, по заявлению, если цифровой товар ещё не был использован, либо по
          соглашению сторон. Уточните в бухгалтерии Исполнителя.{'\n\n'}
          7. Ограничение ответственности: продукт носит информационный, общеобразовательный характер; не является медуслугой, не
          подменяет консультации врачей, ЛФК, невролога, педиатра, логопеда. За жизнь, здоровье, безопасность ребёнка отвечают
          родители/законные представители.{'\n\n'}
          Полный юридический текст оферты размещайте и актуализируйте в документах клуба (сайт/личный кабинет); данный фрагмент
          встроен в приложение для ориентира.
        </Text>
        <View style={styles.hr} />
        <Text style={styles.foot}>
          Клуб «Мама-Супер!», Минск. Контакты — через Instagram @klubmamasuper
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
  hr: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
  foot: { ...FONTS.caption, color: COLORS.textLight, fontStyle: 'italic' },
});
