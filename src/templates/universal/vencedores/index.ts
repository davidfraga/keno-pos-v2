import moment from 'moment';
import { Printer } from '..';
import { getServer } from '../../../services/api';
import { removerAcento } from '../../../utils/removerAcento';
import { BOLDER, SMALL_BOLD } from '../consts';

export const printVencedores = async (
  printer: Printer,
  { vencedores, sorteio, data_sorteio }: VencedoresData,
  pos: IUser & DeviceInfo
) => {
  async function printPrize(prize: 'kuadra' | 'kina' | 'keno') {
    let lastLocal = '';
    for (const cartela of vencedores.filter((x) => x.premio?.toLowerCase() == prize)) {
      if (cartela.premio?.toLocaleLowerCase() !== prize) break;

      if (lastLocal !== cartela.local) {
        lastLocal = cartela.local;
        await printer.printLn(`Local: ${removerAcento(cartela.local)}`, SMALL_BOLD);
      }

      await printer.printLn(`Cartela N: ${cartela.cartela} || Valor: ${cartela?.valor?.toFixed(2)}`);
    }
  }

  await printer.align(0);
  await printer.printDash(); //---------------------------------------------------------
  await printer.printLn(`Resultados`, BOLDER);
  await printer.printLn(`POS: ${pos.pos.id} - ${pos.mac_address?.slice(12)}`);

  await printer.printLn(`SORTEIO: ${sorteio}`);

  if (data_sorteio) await printer.printLn(`HORARIO PARTIDA: ${moment(data_sorteio).format('L LT')}`);

  await printer.printLn(`SERVIDOR: ${getServer()}`);
  await printer.printDash(); //---------------------------------------------------------
  await printer.printLn(`Emissao: ${moment().format('L LTS')}`);

  await printer.align(1);
  await printer.printDash(); //---------------------------------------------------------
  await printer.printLn(`KENO`, BOLDER);
  await printer.printDash(); //---------------------------------------------------------
  await printer.align(0);

  await printPrize('keno');

  await printer.align(1);
  await printer.printDash(); //---------------------------------------------------------
  await printer.printLn(`KINA`, BOLDER);
  await printer.printDash(); //---------------------------------------------------------
  await printer.align(0);

  await printPrize('kina');

  await printer.align(1);
  await printer.printDash(); //---------------------------------------------------------
  await printer.printLn(`KUADRA`, BOLDER);
  await printer.printDash(); //---------------------------------------------------------
  await printer.align(0);

  await printPrize('kuadra');

  await printer.printDash(); //---------------------------------------------------------
  await printer.printLn(`Emissao: ${moment().format('L LTS')}`);
  await printer.printDash(); //---------------------------------------------------------
  await printer.finish();
};
