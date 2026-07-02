import { notaDefault as cartBT, notaPre as cartPreBT } from './universal/cartelas';
import { notaDefault as cartSUNMI } from './sunmi/cartelas';
import { Printer, printerType } from './universal';

export type notaData = {
  printerType: printerType;
  printer?: any;
  sorteio: IBilhete;
  pos: IUser & DeviceInfo;
  reimpressao?: boolean;
  tiny?: boolean;
};

export type preData = {
  printerType: printerType;
  printer?: any;
  sorteio: IBilheteLote;
  pos: IUser & DeviceInfo;
  reimpressao?: boolean;
  tiny?: boolean;
};

export const notaDefault = async (data: notaData) => {
  if (data.printerType.includes('bluetooth') || data.printerType === 'bematech') {
    const printer = await Printer.makePrinter(data.printerType, data.printer);
    return cartBT(printer, data);
  }

  const { printer, sorteio, pos, reimpressao, tiny } = data;
  cartSUNMI(printer, sorteio, pos, reimpressao, tiny);
};

export const notaPre = async (data: preData) => {
  if (data.printerType.includes('bluetooth') || data.printerType === 'bematech') {
    const printer = await Printer.makePrinter(data.printerType, data.printer);
    return cartPreBT(printer, data);
  }
};
