import moment from 'moment';
import { getServer } from '../../../services/api';
import { removerAcento } from '../../../utils/removerAcento';
import { Printer } from '../';
import { BOLDER, SMALL_BOLD } from '../consts';

export const printRecibo = async (
  printer: Printer,
  operacoes: RecolheData,
  pos: IUser & DeviceInfo,
  recebimentos?: IRecebimentos,
  reimpressao = false
) => {
  const op = operacoes.operacoes[0];
  const isAporte = op.tipo === 'Aporte';
  const saldoAtualizado = operacoes.valorAtual + op.valor * (isAporte ? 1 : -1);
  const opTipo = isAporte ? 'Aporte' : 'Recolhe';

  await printer.align(1);

  await printer.printDash(); //---------------------------------------------------------
  await printer.printLn(`Recibo ${opTipo}`, BOLDER);
  await printer.printLn(`POS: ${pos.pos.id} - ${pos.mac_address?.slice(12)}`);
  await printer.printLn(`VENDEDOR: ${removerAcento(pos.usuario.nome)}`);
  await printer.printLn(`ESTABELECIMENTO: ${removerAcento(pos.estabelecimento.nome)}`);
  await printer.printLn(`SERVIDOR: ${getServer()}`);
  await printer.printDash(); //------------------------------------------------------------------------------------
  await printer.printLn(`${reimpressao ? 'Reimpressao' : 'Emissao'}: ${moment().format('L LTS')}`);
  await printer.printDash(); //-----------------------------------------------------------
  await printer.printLn(`Saldo Anterior: ${recebimentos?.saldoAnterior.toFixed(2)}`);
  await printer.printDash(); //------------------------------------------------------------------------------------
  await printer.printLn(`DATA | DOAC | PRE | COM | SALD`);

  if (recebimentos) {
    for (const { data, doacoes, premios, comissao, saldo } of recebimentos.datas) {
      if (saldo === 0) continue;
      const dataTxt = moment(data).format('DD/MM');

      await printer.printLn(
        `${dataTxt}|${doacoes.toFixed(2)}|${premios.toFixed(2)}|${comissao.toFixed(2)}|${saldo.toFixed(2)}`
      );
    }
    await printer.printDash(); //------------------------------------------------------------------------------------
  }

  await printer.align(0);
  await printer.printLn(`Codigo: ${op.id}`, SMALL_BOLD);
  await printer.printLn(`Tipo: ${removerAcento(op.descrição)}`, SMALL_BOLD); // Aporte ou Transferência
  await printer.printLn(`Origem:  ${removerAcento(op.origem).replace('CARTEIRA de ', '')}`, SMALL_BOLD);
  await printer.printLn(`Destino: ${removerAcento(op.destino).replace('CARTEIRA de ', '')}`, SMALL_BOLD);
  await printer.printDash(); //------------------------------------------------------------------------------------

  await printer.printLn(`Saldo Anterior: ${operacoes.valorAtual.toFixed(2)}`, SMALL_BOLD);
  await printer.printLn(`Valor ${opTipo}: ${op.valor.toFixed(2)}`, SMALL_BOLD);
  await printer.printLn(`Saldo Atualizado: ${saldoAtualizado.toFixed(2)}`, SMALL_BOLD);
  await printer.printDash(); //------------------------------------------------------------------------------------
  await printer.printLn(`\n\n`, SMALL_BOLD);
  await printer.finish();
};
