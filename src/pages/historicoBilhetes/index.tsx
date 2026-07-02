import React, { useCallback, useEffect, useMemo, useState, version } from 'react';
import { Button, Card, Layout, List, Text } from '@ui-kitten/components';
import { main, textCenter, title } from './styles';
import { v2 } from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { usePrinter } from '../../context/printer';
import { useAuth } from '../../context/auth/auth';
import Header from '../../components/Header';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { Alert, RefreshControl, Share, View } from 'react-native';
import { notaDefault } from '../../templates/doacao';
import { button } from '../doar/styles';
import { useSettings } from '../../context/settings';
import { compartilharMsg, compartilharMsgNovamente } from '../../utils/compartilhar';

interface BilheteData {
  pooling: string;
  bilhete: string;
  sorteio: number;
  status: -1 | 0 | 1 | 2;
  comprado_em: string;
  valor_compra: number;
  quantidade: number;
  data_partida: string;
  valor_kuadra: number;
  valor_kina: number;
  valor_keno: number;
  valor_cartela: number;
  cartelas: number[];
  fake?: string;
}

interface IRenderItem {
  item: BilheteData;
  loading: boolean;
  onPrint: (pooling: string) => Promise<void>;
  onView: (pooling: string) => Promise<void>;
  onShare: (pooling: string) => Promise<void>;
}

const RenderItem: React.FC<IRenderItem> = ({ item, loading, onPrint, onView, onShare }) => {
  return (
    <Card
      disabled={true}
      key={`est${item.bilhete || item.fake}`}
      status={item.status === -1 ? 'danger' : 'basic'}
      style={[{ marginBottom: 5, height: item.fake ? 100 : undefined }]}
    >
      {!item.fake ? (
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Layout>
            <Text>Sort: {item.sorteio || ''}</Text>
            {/* Nº: {item?.bilhete}{'\n'} */}
            <Text category="c1">
              Cartelas: {item?.cartelas?.[0] || '0000'} à {item?.cartelas?.[item?.cartelas?.length - 1] || '0000'}
            </Text>
            <Text category="c2">Data: {moment(item?.comprado_em).format('L - LTS')}</Text>
          </Layout>
          <Layout
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Button
              onPress={() => onView(item.bilhete)}
              style={{ marginRight: 2 }}
              disabled={true}
              accessoryLeft={() => <Ionicons style={{ color: '#fff' }} name="search" />}
            />
            <Button
              onPress={() => onPrint(item.bilhete)}
              disabled={loading}
              style={{ marginRight: 2 }}
              accessoryLeft={() => <Ionicons style={{ color: '#fff' }} name="print" />}
            />
            {
              <Button
                onPress={() => onShare(item.bilhete)}
                disabled={loading}
                status="success"
                accessoryLeft={() => <Ionicons style={{ color: '#fff' }} name="share-social" />}
              />
            }
          </Layout>
        </Layout>
      ) : null}
    </Card>
  );
};

const Historico = () => {
  const [bilhetes, setBilhetes] = useState<BilheteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState<number>(1);
  const [maxPagina, setMaxPagina] = useState<number>(1);
  const { user, deviceInfo } = useAuth();
  const { driver: altDriver, serverName } = useSettings();
  const { currentPrinter } = usePrinter();
  const nav = useNavigation();

  const userInfo = useMemo(
    () =>
      ({
        ...user,
        ...deviceInfo
      } as IUser & DeviceInfo),
    [deviceInfo, user]
  );

  const handleGetSorteio = useCallback(
    async (pag?: number) => {
      try {
        setBilhetes([]);
        setLoading(true);

        const { data } = await v2.get<{
          lote: BilheteData[];
          pagina: number;
          paginas: number;
        }>(`/historico_bilhetes/${user?.pos.id}/?pagina=${pag || pagina}`);

        setPagina(data.pagina);
        setMaxPagina(data.paginas || 1);
        setLoading(false);
        setBilhetes(data.lote || []);
      } catch (err) {
        setLoading(false);
        if (err?.response?.data?.details) Alert.alert(serverName, err?.response?.data?.details);
        else Alert.alert('Erro Interno', 'Historico não encontrado.');
      }
    },
    [pagina, serverName, user?.pos.id]
  );

  const handlePrint = useCallback(
    async (bilhete: string) => {
      try {
        const { data } = await v2.get<IBilhete>(`/bilhete/${user?.pos.id}/${bilhete}/`);
        // setLoading(true);

        await notaDefault({
          printerType: altDriver,
          printer: currentPrinter,
          sorteio: data,
          pos: userInfo,
          reimpressao: true,
          tiny: true
        });
      } catch {
        // ignore
      }
      setLoading(false);
    },
    [altDriver, currentPrinter, user?.pos.id, userInfo]
  );

  const handleShare = useCallback(
    async (bilhete: string) => {
      try {
        const { data } = await v2.get<IBilhete>(`/bilhete/${user?.pos.id}/${bilhete}/`);
        const mensagem = compartilharMsgNovamente(data, userInfo, version);
        await Share.share({
          message: mensagem
        });
      } catch {
        // ignore
      }
      setLoading(false);
    },
    [altDriver, currentPrinter, user?.pos.id, userInfo]
  );

  const handleView = useCallback(
    async (code: string) => {
      nav.navigate('Cartela', { code, backpage: 'Historico' });
    },
    [nav]
  );

  const mountScreen = useCallback(() => {
    setBilhetes([]);
    handleGetSorteio();
  }, [handleGetSorteio]);

  useEffect(() => {
    mountScreen();
  }, [mountScreen]);

  return (
    <Layout style={main}>
      <Header
        RightIcon={() => (
          <Button
            accessoryRight={() => (
              <Ionicons
                style={{
                  fontSize: 15
                }}
                color="#fff"
                name="refresh"
              />
            )}
            disabled={loading}
            onPress={mountScreen}
            style={button}
          />
        )}
      />
      <Layout style={title}>
        <Text style={textCenter} category="h4">
          Histórico de Doações:
        </Text>
      </Layout>
      <Layout>
        <List
          refreshControl={<RefreshControl refreshing={loading} onRefresh={mountScreen} />}
          persistentScrollbar={true}
          style={{}}
          contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 5 }}
          data={[...(bilhetes || []), { fake: 'bordaItem00' }, { fake: 'bbordaItem01' }]}
          renderItem={(info) => (
            <RenderItem
              item={info.item}
              loading={loading}
              onPrint={handlePrint}
              onShare={handleShare}
              onView={handleView}
            />
          )}
        />
      </Layout>
      <Layout
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          backgroundColor: 'rgba(240, 240, 240, 0.9)',
          width: '100%',
          padding: 15,
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center'
        }}
      >
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          {Array(Math.min(maxPagina, 6))
            .fill(0)
            .map((_, i) => (
              <Button
                style={{
                  marginLeft: 5
                }}
                disabled={loading}
                onPress={() => handleGetSorteio(i + 1)}
                appearance={pagina === i + 1 ? 'filled' : 'outline'}
                status={pagina === i + 1 ? 'primary' : 'basic'}
                key={'pag' + i}
              >
                {i + 1}
              </Button>
            ))}
        </View>
      </Layout>
    </Layout>
  );
};

export default Historico;
