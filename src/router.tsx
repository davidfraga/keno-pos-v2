import React, { useCallback } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Drawer, DrawerItem, IndexPath, Layout } from '@ui-kitten/components';
import Doar from './pages/doar';
// import Recebimentos from './pages/recebimentos';
import Recebimentos from './pages/recebimentos';
import MovimentoDiario from './pages/movimentoDiario';
import Ganhadores from './pages/ganhadores';
import AlterarSenha from './pages/alterarSenha';
import Impressoras from './pages/impressoras';
import PreCompra from './pages/preCompra';
import PagarPremio from './pages/pagarPremio';
import Login from './pages/login';
import { useAuth } from './context/auth/auth';
import { Image, Linking, TouchableOpacity } from 'react-native';
import Historico from './pages/historicoBilhetes';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSettings } from './context/settings';
// import Sorteios from './pages/sorteios';
import { WebView } from 'react-native-webview';
import ExtratoFinanceiro from './pages/extrato';
const { Navigator, Screen } = createDrawerNavigator();

const DrawerContent: React.FC<any> = ({ navigation, state }) => {
  const { signOut, signed } = useAuth();
  const { server, baseDomain } = useSettings();

  const close = useCallback(() => {
    navigation.closeDrawer();
  }, [navigation]);

  const handleSignOut = useCallback(() => {
    signOut();
    close();
  }, [close, signOut]);

  const handleUpdate = useCallback(async () => {
    await Linking.openURL(`https://hub.mrkeno.app/cdn/builds/pos_online.apk`);
    close();
  }, [close]);

  return (
    <Layout style={{ justifyContent: 'space-between', flex: 1 }}>
      <TouchableOpacity activeOpacity={0.7} onPress={close}>
        <Image
          style={{
            width: '100%',
            height: 150,
            marginHorizontal: 0
          }}
          resizeMode="center"
          source={{
            uri: `https://${server || '001'}.${baseDomain}/api/media/logo/`,
            cache: 'only-if-cached'
          }}
        />
      </TouchableOpacity>
      {signed ? (
        <Drawer
          style={{ marginTop: 0 }}
          selectedIndex={new IndexPath(state.index)}
          onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
        >
          <DrawerItem accessoryLeft={() => <FontAwesome5 name="ticket-alt" />} title="Doações" />
          <DrawerItem accessoryLeft={() => <FontAwesome5 name="gift" />} title="Ganhadores" />
          <DrawerItem accessoryLeft={() => <FontAwesome5 name="exchange-alt" />} title="Extrato" />
          {/* <DrawerItem accessoryLeft={() => <FontAwesome5 name="inbox" />} title="Recebimentos/Recolhe" /> */}
          <DrawerItem accessoryLeft={() => <FontAwesome5 name="inbox" />} title="Recebimentos/Recolhe" />
          <DrawerItem accessoryLeft={() => <FontAwesome5 name="history" />} title="Histórico de Doações" />
          <DrawerItem accessoryLeft={() => <FontAwesome5 name="exchange-alt" />} title="Histórico Por Sorteio" />
          {/* <DrawerItem accessoryLeft={() => <FontAwesome5 name="dice" />} title="Replay" /> */}
          <DrawerItem accessoryLeft={() => <FontAwesome5 name="cart-plus" />} title="Pré Compra" />
          {/* <DrawerItem accessoryLeft={() => <FontAwesome5 name="coins" />} title="Pagar Prêmio" /> */}
          <DrawerItem accessoryLeft={() => <FontAwesome5 name="print" />} title="Configurar Impressora" />
          <DrawerItem accessoryLeft={() => <FontAwesome5 name="user" />} title="Alterar Senha" />
        </Drawer>
      ) : (
        <Drawer
          style={{ marginTop: 0 }}
          selectedIndex={new IndexPath(state.index + 1)}
          onSelect={(index) => navigation.navigate(state.routeNames[index.row + 1])}
        ></Drawer>
      )}
      <Layout>
        <DrawerItem accessoryLeft={() => <FontAwesome5 name="sync" />} title="Atualizar" onPress={handleUpdate} />
        {signed ? (
          <>
            <DrawerItem
              accessoryLeft={() => <FontAwesome5 name="sign-out-alt" />}
              title="Sair"
              onPress={handleSignOut}
            />
          </>
        ) : (
          <>
            <DrawerItem
              onPress={() => navigation.navigate(state.routeNames[1])}
              accessoryLeft={() => <FontAwesome5 name="print" />}
              title="Configurar Impressora"
            />
          </>
        )}
      </Layout>
    </Layout>
  );
};

const DrawerNav = ({ signed }: any) => (
  <Navigator drawerContent={({ navigation, state }) => <DrawerContent navigation={navigation} state={state} />}>
    {signed ? (
      <>
        <Screen name="Doações" component={Doar} />
        <Screen name="Ganhadores" component={Ganhadores} />
        <Screen name="Extrato" component={ExtratoFinanceiro} />
        {/* <Screen name="Recolhe" component={Recebimentos} /> */}
        <Screen name="Recolhe" component={Recebimentos} />
        <Screen name="Historico" component={Historico} />
        <Screen name="MovimentoFinanceiro" component={MovimentoDiario} />
        {/* <Screen name="Replay" component={Sorteios} /> */}
        <Screen name="PreCompra" component={PreCompra} />
        {/* <Screen name="PagarPremio" component={PagarPremio} /> */}
        <Screen name="Impressoras" component={Impressoras} />
        <Screen name="AlterarSenha" component={AlterarSenha} />
      </>
    ) : (
      <>
        <Screen name="Login" component={Login} />
        <Screen name="Impressoras" component={Impressoras} />
      </>
    )}
  </Navigator>
);

const Router: React.FC = () => {
  const { signed, user } = useAuth();

  if (signed && user?.nome_server.toLowerCase() == 'pradelivery') {
    return (
      <Layout style={{ width: '100%', height: '100%' }}>
        <WebView source={{ uri: 'https://app.pradelivery.com/' }} />
      </Layout>
    );
  }

  return (
    <NavigationContainer>
      <DrawerNav signed={signed} />
    </NavigationContainer>
  );
};

export default Router;
