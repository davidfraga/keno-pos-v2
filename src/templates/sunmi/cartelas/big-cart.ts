import { formatRow } from '../../../utils/formatNumber';
import SunmiInnerPrinter from 'rn-sunmi-inner-printer';

export const bigCart = async (printer: any, cartela: any) => {
  const { codigo, linha1_lista, linha2_lista, linha3_lista } = cartela;

  await SunmiInnerPrinter.printOriginalText(`${codigo}\n\r`);

  let linha = linha1_lista;
  await SunmiInnerPrinter.printOriginalText('---------------\n\r');
  await SunmiInnerPrinter.printOriginalText(formatRow(linha) + '\n\r');

  linha = linha2_lista;
  await SunmiInnerPrinter.printOriginalText('---------------\n\r');
  await SunmiInnerPrinter.printOriginalText(formatRow(linha) + '\n\r');

  linha = linha3_lista;
  await SunmiInnerPrinter.printOriginalText('---------------\n\r');
  await SunmiInnerPrinter.printOriginalText(formatRow(linha) + '\n\r');
  await SunmiInnerPrinter.printOriginalText('---------------\n\r');
};
