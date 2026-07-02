/* eslint-disable no-prototype-builtins */

import 'react-native-gesture-handler';
import React from 'react';

import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

import { AuthProvider } from './context/auth/auth';
import Router from './router';
import { PrinterProvider } from './context/printer';

import moment from 'moment';
import momentPTBR from 'moment/src/locale/pt-br';
import BackgroundFetchHandler from './services/backgroundFetch';

import { SettingsProvider } from './context/settings';

function prepareLocale(locale: any) {
  for (const key in locale) {
    if (locale.hasOwnProperty(key)) {
      locale[key.substring(1)] = locale[key];
    }
  }
  return locale;
}

moment.updateLocale('pt-br', prepareLocale(momentPTBR));

const backgrounds = {
  'color-basic-100': '#ffffff',
  'color-basic-200': '#f3f3f3',
  'color-basic-300': '#edfbff',
  'color-basic-400': '#e3f9ff',
  'color-basic-500': '#daf7ff',
  'color-basic-600': '#808080',
  'color-basic-700': '#4A4A4A',
  'color-basic-800': '#383838',
  'color-basic-900': '#292929',
  'color-basic-1000': '#1F1F1F',
  'color-basic-1100': '#141414'
};

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...backgrounds }}>
      <SettingsProvider>
        <PrinterProvider>
          <AuthProvider>
            <BackgroundFetchHandler>
              <Router />
            </BackgroundFetchHandler>
          </AuthProvider>
        </PrinterProvider>
      </SettingsProvider>
    </ApplicationProvider>
  );
}
