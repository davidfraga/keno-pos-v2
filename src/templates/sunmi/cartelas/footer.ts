import moment from 'moment';
import SunmiInnerPrinter from 'rn-sunmi-inner-printer';

export const footer = async (
  printer: any,
  { bilhete, datahora, cartelas }: IBilhete,
  pos: IUser & DeviceInfo,
  reimpressao = false
) => {
  const pool = bilhete;

  await SunmiInnerPrinter.setFontSize(25);
  await SunmiInnerPrinter.setAlignment(1);

  await SunmiInnerPrinter.printOriginalText('------------------------\n\r');

  await SunmiInnerPrinter.printOriginalText(`Sequencia de:\n\r`);
  await SunmiInnerPrinter.printOriginalText(
    `${cartelas[0]?.codigo} a ${cartelas?.[cartelas?.length - 1]?.codigo}\n\r`
  );

  await SunmiInnerPrinter.printOriginalText('------------------------\n\r');

  await SunmiInnerPrinter.printOriginalText((pos?.rodape || '') + '\n\r');

  await SunmiInnerPrinter.printOriginalText('------------------------\n\r');

  await SunmiInnerPrinter.printOriginalText(`Bilhete: ${pool} \n\r`);

  await SunmiInnerPrinter.printOriginalText(
    `Emissao: ${moment(datahora).format('L LTS')}\n\r`
  );
  await SunmiInnerPrinter.printOriginalText('------------------------\n\r');
  await SunmiInnerPrinter.setAlignment(1);

  if (reimpressao) {
    await SunmiInnerPrinter.printOriginalText('BILHETE\n\r');
    await SunmiInnerPrinter.printOriginalText('REIMPRESSO\n\r');
    await SunmiInnerPrinter.printOriginalText(
      `DATA: ${moment().format('L LT')}\n\r`
    );
  }
  await SunmiInnerPrinter.printOriginalText('\n\n\n\n\r');
};
