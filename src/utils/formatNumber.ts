export const formatNumber = (num: number) => num.toString().padStart(2, '0');

export const formatRow = (row: number[]) => {
  if (!row) return '';
  return row.map(formatNumber).join('|');
};
