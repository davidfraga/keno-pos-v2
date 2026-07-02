import moment from 'moment';
import { removerAcento } from '../../../utils/removerAcento';
import SunmiInnerPrinter from 'rn-sunmi-inner-printer';
import { getServer } from '../../../services/api';

export const GetTipoSorteio = (tipoSorteio: number) => {
  switch (tipoSorteio) {
    case 0:
      return 'Normal';
    case 1:
      return 'Especial';
    case 2:
      return 'Super Especial';
    default:
      return 'Normal';
  }
};

function replaceAt(str: string, index: number, replacement: string) {
  if (index >= str.length) {
    return str.valueOf();
  }

  return str.substring(0, index) + replacement + str.substring(index + 1);
}

export const header = async (
  _printer: any,
  sorteio: IBilhete,
  pos: IUser & DeviceInfo,
  reimpressao = false,
) => {
  const {
    cartelas,
    data_partida,
    valor_cartela,
    sorteio: codigo,
    tipo_rodada
  } = sorteio;
  let local = removerAcento(cartelas[0].estabelecimento);
  if (local.length >= 16) {
    const lastSpace = local.lastIndexOf(' ');
    local = replaceAt(local, lastSpace, ' \n');
  }

  await SunmiInnerPrinter.setAlignment(1);
  await SunmiInnerPrinter.printOriginalText(`Local \n\r`);
  await SunmiInnerPrinter.setFontSize(50);
  await SunmiInnerPrinter.printOriginalText(`${local}\n\r`);
  await SunmiInnerPrinter.setFontSize(25);
  await SunmiInnerPrinter.printOriginalText(`Sorteio ${tipo_rodada}:\n\r`);
  await SunmiInnerPrinter.setFontSize(50);
  await SunmiInnerPrinter.printOriginalText(`${codigo}\n\r`);
  await SunmiInnerPrinter.setFontSize(25);
  await SunmiInnerPrinter.setAlignment(0);
  await SunmiInnerPrinter.printOriginalText(
    `DATA: ${moment(data_partida).format('L LT')} \n\r`
  );

  await SunmiInnerPrinter.printOriginalText(
    `POS: ${pos.pos.id} - ${pos.mac_address?.slice(12)}\n\r`
  );
  await SunmiInnerPrinter.printOriginalText(
    `ROTA: ${pos.estabelecimento.rota || ''}\n\r`
  );
  await SunmiInnerPrinter.printOriginalText(`SERVIDOR: ${getServer()}\n\r`);
  await SunmiInnerPrinter.printOriginalText(
    `VALOR CARTELA: ${valor_cartela.toFixed(2)}\n\r`
  );
  await SunmiInnerPrinter.printOriginalText(
    `QTD DE CARTELAS: ${cartelas.length}\n\r`
  );

  await SunmiInnerPrinter.setAlignment(1);
  await SunmiInnerPrinter.printOriginalText('valor doado:\n\r');
  await SunmiInnerPrinter.setFontSize(40);
  await SunmiInnerPrinter.printOriginalText(
    `${(valor_cartela * cartelas.length).toFixed(2)}\n\r`
  );
  await SunmiInnerPrinter.setFontSize(30);

  if (reimpressao) {
    await SunmiInnerPrinter.printOriginalText('BILHETE\n\r');
    await SunmiInnerPrinter.printOriginalText('REIMPRESSO\n\r');
    await SunmiInnerPrinter.printOriginalText(
      `DATA: ${moment().format('L LT')}\n\r`
    );
  }
};
