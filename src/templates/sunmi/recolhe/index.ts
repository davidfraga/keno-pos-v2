import moment from 'moment';
import { removerAcento } from '../../../utils/removerAcento';
import SunmiInnerPrinter from 'rn-sunmi-inner-printer';
import { getServer } from '../../../services/api';

export const printRecibo = async (
  printer: any,
  operacoes: RecolheData,
  pos: IUser & DeviceInfo,
  movimento?: IRecebimentos,
  reimpressao = false
) => {
  if (!printer) {
    alert('impressora não conectada');
    return;
  }

  await SunmiInnerPrinter.setAlignment(1);
  await SunmiInnerPrinter.setFontSize(31);

  await SunmiInnerPrinter.printOriginalText('----------------\n\r');
  await SunmiInnerPrinter.setFontSize(50);

  await SunmiInnerPrinter.printOriginalText(`Recibo Recolhe\n\r`);
  await SunmiInnerPrinter.setFontSize(31);

  await SunmiInnerPrinter.printOriginalText(`POS: ${pos.pos.id} - ${pos.mac_address?.slice(12)}\n\r`);
  await SunmiInnerPrinter.printOriginalText(`VENDEDOR: ${removerAcento(pos.usuario.nome)}\n\r`);
  await SunmiInnerPrinter.printOriginalText(`ROTA: ${pos.estabelecimento.rota || ''}\n\r`);
  await SunmiInnerPrinter.printOriginalText(`SERVIDOR: ${getServer()}\n\r`);
  await SunmiInnerPrinter.printOriginalText('----------------\n\r');

  await SunmiInnerPrinter.setAlignment(0);
  await SunmiInnerPrinter.setFontSize(25);

  for (const op of operacoes.operacoes) {
    if (op.tipo) await SunmiInnerPrinter.printOriginalText(`Tipo: ${removerAcento(op.tipo)}\n\r`);

    if (op.descrição) await SunmiInnerPrinter.printOriginalText(`Descricao: ${removerAcento(op.descrição)}\n\r`);

    if (op.origem) await SunmiInnerPrinter.printOriginalText(`Origem: ${removerAcento(op.origem)}\n\r`);

    if (op.id) await SunmiInnerPrinter.printOriginalText(`Codigo: ${op.id}\n\r`);

    if (op.destino) await SunmiInnerPrinter.printOriginalText(`Destino: ${removerAcento(op.destino)}\n\r`);

    await SunmiInnerPrinter.printOriginalText('--------------------\n\r');

    if (op.valor) await SunmiInnerPrinter.printOriginalText(`Valor: ${op.valor.toFixed(2)}\n\r`);

    await SunmiInnerPrinter.printOriginalText(`Data: ${moment(op.data_transacao).format('L - LT')}\n\r`);
    
    await SunmiInnerPrinter.printOriginalText('---------------------\n\r');
  }

  await SunmiInnerPrinter.setFontSize(25);

  await SunmiInnerPrinter.printOriginalText(
    `${reimpressao ? 'Reimpressão' : 'Emissao'}: ${moment().format('L LT')}\n\r`
  );
  await SunmiInnerPrinter.printOriginalText('----------------\n\n\n\r');
};
