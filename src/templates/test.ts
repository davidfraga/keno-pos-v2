import { Printer, printerType } from './universal';
import { printTest } from './universal/sample';

export const testPrint = async (printerDriver: printerType, printer: any) => {
  if (printerDriver.includes('bluetooth') || printerDriver === 'bematech') {
    printTest(await Printer.makePrinter(printerDriver, printer));
  }
};
