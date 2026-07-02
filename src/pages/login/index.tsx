import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Input, Button, Text, Card, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { Modal } from 'react-native-paper';
import { main, content, tinyLogo, backdrop, footerContainer, footerControl, textHolder } from './styles';
import { useAuth } from '../../context/auth/auth';
import { Ionicons } from '@expo/vector-icons';
import { version } from '../../../package.json';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from '../../context/settings';

const Login: React.FC = () => {
  const { signIn, deviceInfo, loading } = useAuth();
  const { server, setServer, baseDomain, serverName, setDomain, clients } = useSettings();
  const [isSecured, setSecured] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [showInfo, setShowInfo] = useState(false);
  const handleToggle = () => setSecured(!isSecured);
  const handleSetEmail = (text: string) => setEmail(text);
  const handleSetPass = (text: string) => setPass(text);
  const isPraDelivery = baseDomain.includes('pradelivery');

  const selectedClient = useMemo(() => clients.find((client) => client.clientName === serverName), [
    clients,
    serverName
  ]);

  const handleSignIn = async () => {
    signIn(email, pass);
  };

  const handleSelectServer = (data: IndexPath | IndexPath[]) => {
    if (Array.isArray(data)) return;
    const server = selectedClient?.servers?.[data.row];
    if (server) setServer(server);
  };
  const handleSelectDomain = (data: IndexPath | IndexPath[]) => {
    if (Array.isArray(data)) return;

    setDomain(clients[data.row]);
  };

  const toggleModal = () => {
    setShowInfo(!showInfo);
  };

  useEffect(() => {
    const getLast = async () => {
      const lastUser = (await AsyncStorage.getItem('@GDSK:user')) || '';
      setEmail(lastUser);
    };

    getLast();
  }, []);

  const Footer = (props: any) => (
    <View {...props} style={[props.style, footerContainer]}>
      <Button onPress={toggleModal} style={footerControl} status="basic" size="small">
        Confirmar
      </Button>
    </View>
  );
  const RenderIcon = () => (
    <TouchableWithoutFeedback onPress={handleToggle} style={{ marginRight: 10 }}>
      <Ionicons
        style={{
          fontSize: 16
        }}
        name={isSecured ? 'eye-off' : 'eye'}
      />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout style={main} level={'4'}>
      <Layout style={content} level={'4'}>
        <Image
          style={tinyLogo}
          resizeMode="contain"
          source={{
            uri: isPraDelivery
              ? 'https://api.pradelivery.com/files/static/logo.png'
              : `https://${server || '001'}.${baseDomain}/api/media/login/`,
            cache: 'only-if-cached'
          }}
          defaultSource={require('../../assets/logo.png')}
          progressiveRenderingEnabled
        />
        <Layout
          style={{
            padding: 25,
            paddingVertical: 30,
            borderRadius: 15
          }}
        >
          {!isPraDelivery && (
            <>
              <Input onChangeText={handleSetEmail} autoCapitalize="none" value={email} placeholder="Usuário" />
              <Input
                style={{ marginVertical: 10, flexDirection: 'row' }}
                onChangeText={handleSetPass}
                autoCapitalize="none"
                placeholder="Senha"
                autoComplete="off"
                value={pass}
                autoCorrect={false}
                contextMenuHidden={true}
                accessoryRight={RenderIcon}
                secureTextEntry={isSecured}
              />
            </>
          )}
          <Button disabled={loading} onPress={handleSignIn}>
            Acessar
          </Button>
        </Layout>
        <Button onPress={toggleModal} appearance="ghost" status="basic" style={{ marginTop: 5 }}>
          Informações do Sistema
        </Button>
      </Layout>
      <Layout level={'4'} style={{ display: 'flex', alignItems: 'center' }}>
        <Text category="c1">
          {serverName}: {version}
        </Text>
      </Layout>

      {showInfo ? (
        <Modal
          visible={showInfo}
          contentContainerStyle={backdrop}
          onDismiss={toggleModal}
          style={{ marginHorizontal: '7%', marginBottom: '10%', width: '85%' }}
        >
          <Layout>
            <Card disabled={true} footer={Footer}>
              <View style={textHolder}>
                <Text category="p1">Marca: </Text>
                <Text category="p2">{deviceInfo?.marca || ''}</Text>
              </View>
              <View style={textHolder}>
                <Text category="p1">Modelo: </Text>
                <Text category="p2">{deviceInfo?.modelo || ''}</Text>
              </View>
              <View style={textHolder}>
                <Text category="p1">Id do Apk: </Text>
                <Text category="p2">{deviceInfo?.build_id || ''}</Text>
              </View>
              <View style={textHolder}>
                <Text category="p1">Operadora: </Text>
                <Text category="p2">{deviceInfo?.chip || ''}</Text>
              </View>
              <View style={textHolder}>
                <Text category="p1">IPV4: </Text>
                <Text category="p2">{deviceInfo?.ip || ''}</Text>
              </View>
              <View style={textHolder}>
                <Text category="p1">Versão Android: </Text>
                <Text category="p2">{deviceInfo?.api_level || ''}</Text>
              </View>
              <View style={textHolder}>
                <Text category="p1">Android Id: </Text>
                <Text category="p2">{deviceInfo?.android_id || ''}</Text>
              </View>
              <View style={textHolder}>
                <Text category="p1">Mac Address: </Text>
                <Text category="p2">{deviceInfo?.mac_address || ''}</Text>
              </View>
              <View style={textHolder}>
                <Text category="p1">Código de Acesso: </Text>
                <Text style={{ fontWeight: 'bold' }} category="p2">
                  {deviceInfo?.access_code || ''}
                </Text>
              </View>
              <View>
                <Select
                  placeholder={
                    baseDomain !== undefined
                      ? serverName
                      : clients
                      ? 'Nenhum Cliente Disponivel'
                      : 'Selecione um Cliente'
                  }
                  label={(evaProps: any) => <Text {...evaProps}>Cliente</Text>}
                  onSelect={handleSelectDomain}
                >
                  {clients ? (
                    <>
                      {clients.map((dominio) => {
                        return (
                          <SelectItem
                            key={`std${dominio.id}`}
                            title={(evaProps: any) => <Text {...evaProps}>{dominio.clientName}</Text>}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                </Select>
              </View>
              <View>
                <Select
                  placeholder={
                    server !== undefined ? server : !selectedClient ? 'Selecione um Cliente' : 'Selecione um Server'
                  }
                  label={(evaProps: any) => <Text {...evaProps}>Server</Text>}
                  onSelect={handleSelectServer}
                >
                  {selectedClient ? (
                    <>
                      {selectedClient.servers?.map((server) => {
                        return (
                          <SelectItem
                            key={`std${server.id}`}
                            title={(evaProps: any) => <Text {...evaProps}>{server.subDomain}</Text>}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                </Select>
              </View>
            </Card>
          </Layout>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Login;
