/* eslint-disable @typescript-eslint/no-unused-vars */
import ArnyGertecPrinter from '../../nativeCode/ArnyGertecPrinter';
import BematechPrinter from '../../nativeCode/BematechPrinter';
import * as DEFAULT_CONSTS from './consts';
import { NL } from './consts';

type PredefStyles = 'BOLD' | 'BOLD2X' | 'BOLDER' | 'SMALL_BOLD' | 'DEFAULT_LINE';
type PrintStyle = {
  widthtimes?: number;
  heigthtimes?: number;
  fonttype?: number;
  align?: AlignmentTypes;
  bold?: boolean;
  [key: string]: any;
};

export interface PrinterData {
  printerAlign: (align: number | string) => Promise<void>;
  printText: (text: string, style: PrintStyle) => Promise<void>;
  [key: string]: any;
}

export type printerType = 'bluetooth' | 'sunmi' | 'bematech' | 'arny_gertec_bluetooth';
export const printerTypes: printerType[] = ['bematech', 'bluetooth', 'arny_gertec_bluetooth', 'sunmi'];

const loggerPrinter: PrinterData = {
  printText: async (text: string, _: PrintStyle) => console.log(text),
  printerAlign: async (_: number | string) => {
    //
  }
};

export type AlignmentTypes = 0 | 1 | 2 | 3 | 4 | 5;

export interface IPrinter extends Partial<PrinterData> {
  align: (alignment: AlignmentTypes) => Promise<any>;
  printLn: (text: string, style?: PrintStyle | PredefStyles) => Promise<any>;
  printDash: (style?: PrintStyle) => Promise<any>;
  finish: () => Promise<any>;
  alignFn?: (alignment: AlignmentTypes) => Promise<any>;
  printLnFn?: (text: string, style?: PrintStyle | PredefStyles) => Promise<any>;
}

export class Printer implements IPrinter {
  type!: printerType;
  lastAlign: AlignmentTypes = 0;
  styles!: Record<PredefStyles, PrintStyle>;

  alignFn!: (alignment: AlignmentTypes) => Promise<any>;

  printLnFn!: (text: string, style: any) => Promise<any>;

  printDash!: (style?: PrintStyle | undefined) => Promise<any>;

  finish!: () => Promise<any>;

  printerAlign?: ((align: string | number) => Promise<void>) | undefined;

  printText?: ((text: string, style: PrintStyle) => Promise<void>) | undefined;

  qrCode!: (data: string) => Promise<void> | void;

  constructor(data: Partial<IPrinter>) {
    Object.assign(this, data);
    if (data.type === 'bematech') this.connect();
  }

  async align(alignment: AlignmentTypes) {
    this.lastAlign = alignment;
    return this.alignFn?.(alignment);
  }

  async connect() {
    if (this.type !== 'bematech') return;

    return BematechPrinter.connect();
  }

  async printLn(text: string, style?: PrintStyle | PredefStyles | undefined) {
    text = `${text}${this.type !== 'arny_gertec_bluetooth' ? NL : ''}`;
    style = (!style || typeof style === 'string' ? this.styles[style || 'DEFAULT_LINE'] : style) || {};

    return this.printLnFn(text, { ...style, align: this.lastAlign });
  }

  async printQrCode(data: string) {
    await this.alignFn?.(1);
    const r = await this.qrCode(data);
    await this.alignFn?.(this.lastAlign);
    return r;
  }

  static async makePrinter(type: printerType = 'bluetooth', printer?: PrinterData) {
    if (type.includes('bluetooth') && !printer) {
      if (process.env.NODE_ENV !== 'development') alert('impressora não conectada');

      printer = loggerPrinter;
      type = 'bluetooth';
    }

    if (type === 'bematech') {
      const status = BematechPrinter.checkConnection();
      if (!status) {
        await BematechPrinter.connect();
      }
    }

    const convertToTextAlign = (number?: AlignmentTypes) => {
      if (!number) return 'LEFT';
      switch (number.toString()) {
        case '1' || '4':
          return 'CENTER';
        case '2' || '5':
          return 'RIGHT';
        case '0' || '3':
          return 'LEFT';
      }
    };

    const alType = {
      sunmi: [0, 1, 2, 48, 49, 50],
      bluetooth: [0, 1, 2, 48, 49, 50],
      bematech: [0, 1, 2, 48, 49, 50],
      arny_gertec_bluetooth: [0, 1, 2, 48, 49, 50]
    }[type];

    const styles: Record<PredefStyles, PrintStyle> = {
      bluetooth: { ...DEFAULT_CONSTS },
      sunmi: { ...DEFAULT_CONSTS },
      bematech: { ...DEFAULT_CONSTS },
      arny_gertec_bluetooth: { ...DEFAULT_CONSTS }
    }[type];

    const presets = {
      bluetooth: { ...DEFAULT_CONSTS },
      sunmi: { ...DEFAULT_CONSTS },
      bematech: { ...DEFAULT_CONSTS },
      arny_gertec_bluetooth: { ...DEFAULT_CONSTS }
    }[type];

    const alignFn = {
      bluetooth: async (alignment: number | string) => await printer?.printerAlign(alignment),
      bematech: () => ({}),
      sunmi: () => ({}),
      arny_gertec_bluetooth: () => ({})
    }[type];

    const printFn = {
      bluetooth: async (text: string, style: PrintStyle) => printer?.printText(text, style),
      bematech: async (text: string, style: PrintStyle) => {
        const size = style.size || (style.heigthtimes ? [34, 42][style.heigthtimes - 1] || 24 : 24);
        return BematechPrinter.appendText(`${text}`, size, style.align ?? 0, (style.heigthtimes || 0) >= 1);
      },
      sunmi: async (text: string, _?: PrintStyle) => ({}),
      arny_gertec_bluetooth: async (text: string, style?: PrintStyle) => {
        await ArnyGertecPrinter.imprimeTexto(
          text,
          style?.bold ? 'DEFAULT BOLD' : 'DEFAULT',
          24,
          style?.bold || false,
          false,
          false,
          convertToTextAlign(style?.align || 0),
          10
        );
      }
    }[type];

    const finishPrint = {
      bluetooth: async () => ({}),
      bematech: async () => await BematechPrinter.print(),
      sunmi: async () => ({}),
      arny_gertec_bluetooth: async () => ArnyGertecPrinter.fimImpressao()
    }[type];

    const printDash = {
      bluetooth: async (style?: PrintStyle) => printFn(`${presets.FULL_LINE}`, style || styles.BOLDER),
      bematech: async (style?: PrintStyle) =>
        printFn(`--------------------------------`, { ...(style || styles.BOLDER), align: 1 }),
      sunmi: async (style?: PrintStyle) => printFn(`${presets.FULL_LINE}`, style || styles.BOLDER),
      arny_gertec_bluetooth: async (style?: PrintStyle) =>
        ArnyGertecPrinter.imprimeTexto(
          `-----------------------------`,
          'DEFAULT BOLD',
          32,
          true,
          false,
          false,
          'CENTER',
          10
        )
    }[type];

    const qrCodeFn = {
      bluetooth: async (data: string) => printer?.printQRCode(data, 300, 2),
      bematech: async (data: string) => await BematechPrinter.print(),
      sunmi: async (data: string) => ({}),
      arny_gertec_bluetooth: async (data: string) => await ArnyGertecPrinter.imprimeBarCode(data, 450, 450, 'QR_CODE')
    }[type];

    return new Printer({
      ...(printer || {}),
      type,
      styles,
      qrCode: qrCodeFn,
      alignFn: async (alignment: 0 | 1 | 2 | 3 | 4 | 5) => alignFn(alType[alignment]),
      printLnFn: async (text: string, style: any) => printFn(text, style),
      printDash: async (style?: PrintStyle) => printDash(style),
      finish: async () => finishPrint()
    });
  }
}
