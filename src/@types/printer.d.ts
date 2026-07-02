declare type PrinterData = {
  name: string;
  address: string;
};

declare interface IPrinter extends PrinterData {
  [key: string]: any;
}
