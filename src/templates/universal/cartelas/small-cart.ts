import { Printer } from '..';
import { formatRow } from '../../../utils/formatNumber';

export const smallCart = async (printer: Printer, cartelas: Cartela[]) => {
  const c1 = cartelas[0];
  const c2 = cartelas[1];

  if (!c2) {
    await printer.align(1);
    await printer.printLn(`${c1?.codigo || ''}`, 'BOLD2X');
  } else {
    await printer.printLn(
      `${c1?.codigo.toString().padEnd(8, ' ') || ''}${c2?.codigo.toString().padStart(8, ' ') || ''}`,
      'BOLD'
    );
  }

  await printer.printDash(); //-------------------------------------------
  await printer.printLn(formatRow(c1?.linha1_lista) + '  ' + formatRow(c2?.linha1_lista));

  await printer.printDash(); //-------------------------------------------
  await printer.printLn(formatRow(c1?.linha2_lista) + '  ' + formatRow(c2?.linha2_lista));

  await printer.printDash(); //-------------------------------------------
  await printer.printLn(formatRow(c1?.linha3_lista) + '  ' + formatRow(c2?.linha3_lista));
  await printer.printDash(); //-------------------------------------------
};
