/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';
import { Printer } from '..';
import { getPreServer, getServer } from '../../../services/api';
import { removerAcento } from '../../../utils/removerAcento';
import { version } from '../../../../package.json';

function replaceAt(str: string, index: number, replacement: string) {
  if (index >= str.length) {
    return str.valueOf();
  }
  return str.substring(0, index) + replacement + str.substring(index + 1);
}

export const header = async (printer: Printer, sorteio: IBilhete, pos: IUser & DeviceInfo, reimpressao = false, precompra = false) => {
  const { cartelas, data_partida, valor_cartela, sorteio:codigo, tipo_rodada } = sorteio;
  
  let local = removerAcento(cartelas[0].estabelecimento);

  const nomeMuitoGrande = local.length >= 16;

  if (nomeMuitoGrande) {
    const lastSpace = local.lastIndexOf(' ');
    local = replaceAt(local, lastSpace, ' \n');
  }

  await printer.align(1);
  await printer.printLn('LOCAL:');
  await printer.printLn(`${local}`, !nomeMuitoGrande ? 'BOLD2X' : 'BOLD');
  await printer.printLn(`SORTEIO ${tipo_rodada || ''}:`);
  await printer.printLn(`${codigo}`, 'BOLD2X');
  await printer.align(0);
  await printer.printLn(`DATA: ${moment(data_partida).format('L LT')} `);
  await printer.printLn(`POS: ${pos.pos.id} - ${pos.mac_address?.slice(12)} ${version}`);
  await printer.printLn(`VENDEDOR: ${pos.usuario.nome || ''}`);
  await printer.printLn(`FRANQUIA: ${getPreServer()}`);
  await printer.printLn(`CLIENTE: ${pos.estabelecimento.rota}`);
  await printer.printLn(`VALOR CARTELA: ${valor_cartela.toFixed(2)}`);
  await printer.printLn(`QTD DE CARTELAS: ${cartelas.length}`);
  await printer.printLn(`BILHETE: ${sorteio.bilhete} `);
  await printer.printLn(`EMISSAO: ${moment().format('L LTS')}`);
  await printer.printDash();
  await printer.printLn('VALOR DOADO:');
  await printer.printLn(`${(valor_cartela * cartelas.length).toFixed(2)}`, 'BOLD2X');
  
  if (reimpressao) {
    await printer.printDash();
    await printer.printLn('REIMPRESSAO', 'BOLD');
  }
};

export const pre_header = async (printer: Printer, sorteio: IBilheteLote, pos: IUser & DeviceInfo, reimpressao = false, precompra = false) => {
  const { cartelas, data_partida, valor_cartela, sorteio:codigo, tipo_rodada } = sorteio.bilhetes[0];
  let local = removerAcento(cartelas[0].estabelecimento);

  const nomeMuitoGrande = local.length >= 16;

  if (nomeMuitoGrande) {
    const lastSpace = local.lastIndexOf(' ');
    local = replaceAt(local, lastSpace, ' \n');
  }

  await printer.align(1);
  await printer.printLn('ESTABELECIMENTO:');
  await printer.printLn(`${local}`, !nomeMuitoGrande ? 'BOLD2X' : 'BOLD');
  await printer.align(0);
  await printer.printLn(`POS: ${pos.pos.id} - ${pos.mac_address?.slice(12)} ${version}`);
  await printer.printLn(`VENDEDOR: ${pos.usuario.nome || ''}`);
  await printer.printLn(`ROTA: ${getServer()}`);
  await printer.printLn(`VALOR PULE: ${sorteio.valor_doado}`);
  await printer.printLn(`QTD DE BILHETES: ${sorteio.bilhetes.length}`);
  await printer.printLn(`PULE: ${sorteio.codigo} `);
  await printer.printLn(`EMISSAO: ${moment().format('L LTS')}`);
  
  if (reimpressao) {
    await printer.printDash(); // ------------------------------------------------------------------
    await printer.printLn('REIMPRESSAO', 'BOLD');
  }
};
