import moment from 'moment';
import { Printer } from '..';
import { separarArray } from '../../../utils/separarArray';
import { bigCart } from './big-cart';
import { smallCart } from './small-cart';

export const body = async (printer: Printer, { cartelas, tipo_impressao }: IBilhete) => {
  if (tipo_impressao === 'S') return printer.printDash()

  const resize = tipo_impressao === 'L' || tipo_impressao !== 'I' && cartelas.length >= 6;

  const carts = resize ? separarArray(cartelas, 2) : cartelas;

  await printer.align(1);
  await printer.printDash();

  for (let i = 0; i < carts.length; i++) {
    const cart = carts[i];

    if (Array.isArray(cart)) {
      await smallCart(printer, cart);
      continue;
    }
    await bigCart(printer, cart);
  }
};

export const pre_body = async (printer: Printer, { cartelas, tipo_impressao, valor_cartela, bilhete, sorteio: codigo, data_partida, tipo_rodada }: IBilhete) => {
  await printer.align(0);
  await printer.printDash(); // ----------------------------------------------------------
  await printer.printLn(`SORTEIO: ${codigo}`, 'BOLD');
  await printer.printLn(`SORTEIO ${tipo_rodada || ''}`);
  await printer.printLn(`DATA PARTIDA: ${moment(data_partida).format('L LT')} `);
  await printer.printLn(`BILHETE: ${bilhete}`);
  await printer.printLn(`QTD DE CARTELAS: ${cartelas.length}`);
  await printer.printLn(`VALOR CARTELA: ${valor_cartela.toFixed(2)}`);
  await printer.printLn(`VALOR BILHETE: ${(valor_cartela * cartelas.length).toFixed(2)}`);
  await printer.printLn('');
  if (cartelas.length > 1) {
    await printer.printLn(`SEQUENCIA DE:`);
    await printer.printLn(`${cartelas[0]?.codigo} a ${cartelas?.[cartelas?.length - 1]?.codigo}`, 'BOLD');
  } else {
    await printer.printLn(`CARTELA: ${cartelas[0]?.codigo}`, 'BOLD');
  }
  if (tipo_impressao === 'S') return printer.printDash()

  const resize = tipo_impressao === 'L' || tipo_impressao !== 'I' && cartelas.length >= 6;

  const carts = resize ? separarArray(cartelas, 2) : cartelas;

  await printer.align(1);
  await printer.printDash(); // ---------------------------------------------------

  for (let i = 0; i < carts.length; i++) {
    const cart = carts[i];

    if (Array.isArray(cart)) {
      await smallCart(printer, cart);
      continue;
    }

    await bigCart(printer, cart);
  }

};
