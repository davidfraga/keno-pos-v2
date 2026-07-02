import { Printer } from '..';
import { formatRow } from '../../../utils/formatNumber';

export const bigCart = async (printer: Printer, cartela: Cartela) => {
  const { codigo, linha1_lista, linha2_lista, linha3_lista } = cartela;

  await printer.align(4);
  await printer.printLn(`${codigo}`, 'BOLD2X');
  await printer.printDash(); //--------------------------||
  await printer.printLn(formatRow(linha1_lista), 'BOLD2X');
  await printer.printDash(); //--------------------------||
  await printer.printLn(formatRow(linha2_lista), 'BOLD2X');
  await printer.printDash(); //--------------------------||
  await printer.printLn(formatRow(linha3_lista), 'BOLD2X');
  await printer.printDash(); //--------------------------||
};
