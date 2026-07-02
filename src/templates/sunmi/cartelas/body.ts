import { separarArray } from '../../../utils/separarArray';
import { bigCart } from './big-cart';
import { smallCart } from './small-cart';
import SunmiInnerPrinter from 'rn-sunmi-inner-printer';

export const body = async (printer: any, { cartelas }: IBilhete) => {
  const resize = cartelas.length >= 6;
  const carts = resize ? separarArray(cartelas, 2) : cartelas;
  const method = resize ? smallCart : bigCart;

  await SunmiInnerPrinter.setFontSize(resize ? 22 : 30);
  await SunmiInnerPrinter.setAlignment(1);
  await SunmiInnerPrinter.printOriginalText('------------------\n\r');

  for (let i = 0; i < carts.length; i++) {
    const cart = carts[i];
    await method(printer, cart);
  }

  await SunmiInnerPrinter.printOriginalText('-----------------\n\r');
};
