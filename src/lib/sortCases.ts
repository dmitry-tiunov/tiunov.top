import type { CollectionEntry } from 'astro:content';
import caseOrder from '../data/cases-order.json';

// Порядок кейсов задаётся списком в админке (Настройки → Порядок кейсов); кейсы не из списка идут после, по полю order
export function sortCases(list: CollectionEntry<'cases'>[]) {
  const pos = (id: string) => {
    const i = caseOrder.cases.indexOf(id);
    return i === -1 ? Infinity : i;
  };
  return list.sort((a, b) => pos(a.id) - pos(b.id) || a.data.order - b.data.order);
}
