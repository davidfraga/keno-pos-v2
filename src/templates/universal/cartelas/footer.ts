import { Printer } from '..';
import { sorteio } from '../../../utils/data/sorteio';
import { removerAcento } from '../../../utils/removerAcento';

export const footer = async (
  printer: Printer,
  { bilhete, cartelas }: IBilhete,
  pos: IUser & DeviceInfo,
) => {
  await printer.align(0);

  if (cartelas.length > 1) {
    await printer.printLn(`SEQUENCIA DE:`);
    await printer.printLn(`${cartelas[0]?.codigo} a ${cartelas?.[cartelas?.length - 1]?.codigo}`, 'BOLD');
  } else {
    await printer.printLn(`CARTELA: ${cartelas[0]?.codigo}`, 'BOLD');
  }

  await printer.printDash(); //-----------------------------------------
  await printer.printLn(removerAcento(pos?.rodape || ''));
  await printer.printDash(); //-----------------------------------------
  await printer.printLn(`https://${pos?.url_qrcode}/?bilhete=${bilhete}`);
  await printer.qrCode(`https://${pos?.url_qrcode}/?bilhete=${bilhete}`);

  await printer.printLn('\n\n'); // Isto serve para dar espaçamento após a impressão
};

const sorteios_cancelados = (bilhetes_invalidos: IBilheteInvalido[]) => {
  let str = ''
  bilhetes_invalidos.map((bilhete) => {
    str += bilhete.partida + ','
  })
  return str
}

export const pre_footer = async (
  printer: Printer,
  { bilhetes_invalidos, codigo }: IBilheteLote,
  pos: IUser & DeviceInfo,
) => {
  await printer.align(0);
  if (bilhetes_invalidos.length > 0) {
    await printer.printLn(`Sorteio(s) Nao Efetivados`)
    await printer.printLn(`por Apostas Encerradas:${sorteios_cancelados(bilhetes_invalidos)}`)
  }
  await printer.printDash(); //-----------------------------------------
  await printer.printLn(removerAcento(pos?.rodape || ''));
  await printer.printDash(); //-----------------------------------------
  await printer.printLn(`https://${pos?.url_qrcode}/?pule=${codigo}`);
  await printer.qrCode(`https://${pos?.url_qrcode}/?pule=${codigo}`);
  await printer.printLn('\n\n'); // Isto serve para dar espaçamento após a impressão
};