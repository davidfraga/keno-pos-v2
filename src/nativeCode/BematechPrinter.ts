import { NativeModules } from 'react-native';

const { BematechSdk } = NativeModules;

type intensityLevels = 0 | 1 | 2 | 3 | 4;

interface IBematech {
  appendText(text: string, fontSize: number, alignment: number, isBold: boolean): Promise<boolean>;
  setIntensity(value: intensityLevels): Promise<void>;
  print(): Promise<string>;
  init(): Promise<void>;
  printTest(): Promise<void>;
  connect(): Promise<void>;
  checkConnection(): Promise<boolean>;
}

export default BematechSdk as IBematech;
