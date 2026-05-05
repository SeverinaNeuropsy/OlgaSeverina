const YT = (id) => `https://www.youtube.com/embed/${id}`;
/** Замените id роликов на видео от Клуба «Мама-Супер!» (Instagram: @klubmamasuper, @severina.neuropsy). */
export const PLACEHOLDER_VIDEO = 'dQw4w9WgXcQ';

export function videoList(titles) {
  return titles.map((title, i) => ({
    title,
    url: YT(PLACEHOLDER_VIDEO),
    note: 'Демо-вставка. Подставьте ссылку на урок из материалов клуба.',
  }));
}

export const RU_BY_NORMS_FOOTER =
  'Ориентиры согласованы с клиническими рекомендациями в РФ/РБ: индивидуальные сроки вариативны. При сомнениях — педиатр, невролог, ЛФК, логопед.';
