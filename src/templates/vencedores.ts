import { printVencedores as vencedoresUNI } from './sunmi/vencedores';
import { Printer, printerType } from './universal';
import { printVencedores as vencedoresBT } from './universal/vencedores';

export const printVencedores = async (
  printerDriver: printerType,
  printer: any,
  vencedores: VencedoresData,
  pos: IUser & DeviceInfo
) => {
  if (printerDriver.includes('bluetooth') || printerDriver === 'bematech') {
    vencedoresBT(await Printer.makePrinter(printerDriver, printer), vencedores, pos);
  } else {
    vencedoresUNI(printer, vencedores, pos);
  }
};
