import { Layout } from '@ui-kitten/components';
import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../components/Header';
import { useAuth } from '../../context/auth/auth';
import { main } from './styles';

export default function App() {
  const [url, setUrl] = useState('');
  const { deviceInfo, user } = useAuth();
  const userInfo = useMemo(
    () =>
      ({
        ...user,
        ...deviceInfo
      } as IUser & DeviceInfo),
    [deviceInfo, user]
  );
  return (
    <Layout style={main} level={'4'}>
      <Header></Header>
      <WebView source={{ uri: `https://${userInfo?.url_qrcode}/comprar` }} />
    </Layout>
  );
}
