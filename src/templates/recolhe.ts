import { printRecibo as recolheSUNMI } from './sunmi/recolhe';
import { Printer, printerType } from './universal';
import { printRecibo as recolheBT } from './universal/recolhe';

export const printRecolhe = async (
  printerDriver: printerType,
  printer: any,
  operacoes: RecolheData,
  pos: IUser & DeviceInfo,
  recebimentos?: IRecebimentos,
  reimpressao = false
) => {
  if (printerDriver.includes('bluetooth') || printerDriver === 'bematech') {
    recolheBT(await Printer.makePrinter(printerDriver, printer), operacoes, pos, recebimentos, reimpressao);
  } else {
    recolheSUNMI(printer, operacoes, pos, recebimentos, reimpressao);
  }
};
