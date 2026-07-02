import moment from 'moment';
import { removerAcento } from '../../../utils/removerAcento';
import SunmiInnerPrinter from 'rn-sunmi-inner-printer';
import { getServer } from '../../../services/api';

export const printVencedores = async (
  printer: any,
  {vencedores, sorteio}: VencedoresData,
  pos: IUser & DeviceInfo
) => {
  if (!printer) {
    alert('impressora não conectada');
    return;
  }

  const carts = [
    ...vencedores.filter((x) => x.premio?.toLowerCase() == 'keno'),
    ...vencedores.filter((x) => x.premio?.toLowerCase() == 'kina'),
    ...vencedores.filter((x) => x.premio?.toLowerCase() == 'kuadra')
  ];

  await SunmiInnerPrinter.setAlignment(1);
  await SunmiInnerPrinter.printOriginalText('-------------------\n\r');
  await SunmiInnerPrinter.printOriginalText(`Resultados\n\r`);
  await SunmiInnerPrinter.printOriginalText(
    `POS: ${pos.pos.id} - ${pos.mac_address?.slice(12)}\n\r`
  );
  await SunmiInnerPrinter.printOriginalText(`SORTEIO: ${sorteio}\n\r`);
  await SunmiInnerPrinter.printOriginalText(
    `ROTA: ${pos.estabelecimento.rota || ''}\n\r`
  );
  await SunmiInnerPrinter.printOriginalText(`SERVIDOR: ${getServer()}\n\r`);
  await SunmiInnerPrinter.setAlignment(1);
  await SunmiInnerPrinter.printOriginalText('-------------------\n\r');
  await SunmiInnerPrinter.printOriginalText(`KENO\n\r`);
  await SunmiInnerPrinter.printOriginalText('-------------------\n\r');

  let lastLocal = '';
  let i = 0;
  for (; i < carts.length; i++) {
    const cartela = carts[i];
    if (cartela.premio?.toLocaleLowerCase() !== 'keno') break;
    if (lastLocal !== cartela.local) {
      lastLocal = cartela.local;
      await SunmiInnerPrinter.printOriginalText(
        `Local: ${removerAcento(cartela.local)}\n\r`
      );
    }
    await SunmiInnerPrinter.printOriginalText(
      `Cartela N: ${cartela.cartela} || Valor: ${cartela?.valor?.toFixed(
        2
      )}\n\r`
    );
  }

  await SunmiInnerPrinter.setAlignment(1);
  await SunmiInnerPrinter.printOriginalText('-------------------\n\r');
  await SunmiInnerPrinter.printOriginalText(`KINA\n\r`);
  await SunmiInnerPrinter.printOriginalText('-------------------\n\r');

  lastLocal = '';
  for (; i < carts.length; i++) {
    const cartela = carts[i];
    if (cartela.premio?.toLocaleLowerCase() !== 'kina') break;
    if (lastLocal !== cartela.local) {
      lastLocal = cartela.local;
      await SunmiInnerPrinter.printOriginalText(
        `Local: ${removerAcento(cartela.local)}\n\r`
      );
    }
    await SunmiInnerPrinter.printOriginalText(
      `Cartela N: ${cartela.cartela} || Valor: ${cartela?.valor?.toFixed(
        2
      )}\n\r`
    );
  }

  await SunmiInnerPrinter.setAlignment(1);
  await SunmiInnerPrinter.printOriginalText('-------------------\n\r');
  await SunmiInnerPrinter.printOriginalText(`KUADRA\n\r`);
  await SunmiInnerPrinter.printOriginalText('-------------------\n\r');

  lastLocal = '';
  for (; i < carts.length; i++) {
    const cartela = carts[i];
    if (cartela.premio?.toLocaleLowerCase() !== 'kuadra') break;
    if (lastLocal !== cartela.local) {
      lastLocal = cartela.local;
      await SunmiInnerPrinter.printOriginalText(
        `Local: ${removerAcento(cartela.local)}\n\r`
      );
    }
    await SunmiInnerPrinter.printOriginalText(
      `Cartela N: ${cartela.cartela} || Valor: ${cartela?.valor?.toFixed(
        2
      )}\n\r`
    );
  }
  await SunmiInnerPrinter.setAlignment(1);
  await SunmiInnerPrinter.printOriginalText('-------------------\n\r');
  await SunmiInnerPrinter.printOriginalText(
    `Emissao: ${moment().format('L LTS')}\n\r`
  );
  await SunmiInnerPrinter.printOriginalText('-------------------\n\r');
};
