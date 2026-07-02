import { formatRow } from '../../../utils/formatNumber';
import SunmiInnerPrinter from 'rn-sunmi-inner-printer';

export const smallCart = async (printer: any, cartelas: any) => {
  const c1 = cartelas[0];
  const c2 = cartelas[1];
  const separador = '--------------------\n\r';

  await SunmiInnerPrinter.printOriginalText(separador);
  await SunmiInnerPrinter.setFontSize(25);
  if (!c2) {
    await SunmiInnerPrinter.setAlignment(1);
    await SunmiInnerPrinter.printOriginalText(`${c1?.codigo}\n\r`);
  } else {
    await SunmiInnerPrinter.printOriginalText(
      `${c1?.codigo || ''}            ${c2?.codigo || ''}\n\r`
    );
  }
  await SunmiInnerPrinter.setFontSize(22);

  let linha = formatRow(c1?.linha1_lista) + '  ' + formatRow(c2?.linha1_lista);
  await SunmiInnerPrinter.printOriginalText(separador);
  await SunmiInnerPrinter.printOriginalText(linha + '\n\r');

  linha = formatRow(c1?.linha2_lista) + '  ' + formatRow(c2?.linha2_lista);
  await SunmiInnerPrinter.printOriginalText(separador);
  await SunmiInnerPrinter.printOriginalText(linha + '\n\r');

  linha = formatRow(c1?.linha3_lista) + '  ' + formatRow(c2?.linha3_lista);
  await SunmiInnerPrinter.printOriginalText(separador);
  await SunmiInnerPrinter.printOriginalText(linha + '\n\r');
};
