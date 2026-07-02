import { Printer } from '..';

export const printTest = async (
  printer: Printer,
) => {
  await printer.printDash(); //---------------------------------------------------------
  await printer.qrCode("test");
  await printer.qrCode("test2");
  await printer.qrCode("test3");
  await printer.printDash(); //---------------------------------------------------------
  await printer.finish();
};
