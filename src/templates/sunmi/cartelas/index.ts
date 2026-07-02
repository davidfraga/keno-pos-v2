import { body } from './body';
import { footer } from './footer';
import { header } from './header';
export { GetTipoSorteio } from './header';

export const notaDefault = async (
  printer: any,
  sorteio: IBilhete,
  pos: IUser & DeviceInfo,
  reimpressao = false,
  tiny = false
) => {
  await header(printer, sorteio, pos, reimpressao);
  if (!tiny) await body(printer, sorteio);
  await footer(printer, sorteio, pos, reimpressao);
};
