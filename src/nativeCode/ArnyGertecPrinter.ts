import { NativeModules } from 'react-native';

const ArnyGertecPrinter = NativeModules.GertecSdk;

interface IArnyGertec {
  imprimeTexto(
    texto: string,
    fontFamily?: 'NORMAL' | 'DEFAULT' | 'DEFAULT BOLD' | 'MONOSPACE' | 'SANS SERIF' | 'SERIF',
    fontSize?: number,
    bold?: boolean,
    itallic?: boolean,
    underline?: boolean,
    alignemnt?: 'LEFT' | 'RIGHT' | 'CENTER',
    spacing?: number
  ): Promise<void>;
  fimImpressao: () => Promise<void>;
  imprimeBarCode: (
    texto: string,
    height: number,
    width: number,
    barCodeType: 'CODE_128' | 'EAN_13' | 'QR_CODE'
  ) => Promise<void>;
}
export default ArnyGertecPrinter as IArnyGertec;
