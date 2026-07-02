// import encondigs from './encodings';
import { Printer } from '..';
import { notaData, preData } from '../../doacao';
import { body, pre_body } from './body';
import { footer, pre_footer } from './footer';
import { header, pre_header} from './header';

type payload = Pick<notaData, 'sorteio' | 'pos' | 'reimpressao' | 'tiny'>;
type prepayload = Pick<preData, 'sorteio' | 'pos' | 'reimpressao' | 'tiny'>;

export const notaDefault = async (printer: Printer, { sorteio, pos, reimpressao, tiny }: payload) => {
  await header(printer, sorteio, pos, reimpressao);
  await body(printer, sorteio);
  await footer(printer, sorteio, pos, reimpressao);

  await printer.finish();
};

export const notaPre = async (printer: Printer, { sorteio, pos, reimpressao, tiny }: prepayload) => {
  await pre_header(printer, sorteio, pos, reimpressao);
  for(var _i = 0; _i < sorteio.bilhetes.length; _i++){
    const bilhete = { ...sorteio.bilhetes[_i], sorteio: sorteio.bilhetes[_i].sorteio};
    await pre_body(printer, sorteio.bilhetes[_i]);
  }
  await pre_footer(printer, sorteio, pos);
  await printer.finish();

};