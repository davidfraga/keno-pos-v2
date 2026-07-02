import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Input, Layout, List, Text } from '@ui-kitten/components';
import { main, textCenter, title, search, buttonRow } from './styles';
import { v2 } from '../../services/api';
import { useAuth } from '../../context/auth/auth';
import Header from '../../components/Header';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { Alert, RefreshControl, View } from 'react-native';
import { button } from '../doar/styles';
import { sorteioColor } from '../../utils/sorteioColors';

interface Partida {
  codigo: string;
  id_replay: string;
  tipo: string;
  data: string;
  datahora: string;
  fake: string;
  ja_replay: boolean;
}

interface IRenderItem {
  item: Partida;
  loading: boolean;
  proximo: string | undefined;
  onReplay: (pooling: string) => Promise<void>;
}

const RenderItem: React.FC<IRenderItem> = ({ proximo, item, loading, onReplay }) => {
  const proxBlock = !!(proximo && moment(proximo).isSameOrBefore(moment().add(8, 'minutes')));

  const handleReplay = (cod: string) => {
    if (proxBlock) return;
    onReplay(cod);
  };

  return (
    <Card
      disabled={true}
      key={`est${item.codigo || item.fake}`}
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
            <Text>
              Sorteio {item.codigo} | Replay: {item.id_replay}
            </Text>
            <Text category="c1" style={{ color: sorteioColor({ tipo_rodada: item.tipo } as any) }}>
              Tipo: {item.tipo}
            </Text>
            <Text category="c2">Data: {moment(item?.data).format('L - LT')}</Text>
          </Layout>
          <Layout
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Button
              onPress={() => handleReplay(item.id_replay)}
              style={{ marginRight: 2 }}
              disabled={loading || item.ja_replay}
              status={proxBlock ? 'warning' : undefined}
              accessoryLeft={() => <Ionicons style={{ color: '#fff' }} name="tv" />}
            >
              Replay
            </Button>
          </Layout>
        </Layout>
      ) : null}
    </Card>
  );
};

const Sorteios = () => {
  const [bilhetes, setBilhetes] = useState<Partida[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState<number>(1);
  const [sorteio, setSorteio] = useState<string>('');
  const [maxPagina, setMaxPagina] = useState<number>(1);
  const [proximo, setProximo] = useState<string>();
  const { user } = useAuth();

  const handleGetSorteio = useCallback(
    async (pag?: number) => {
      try {
        setBilhetes([]);
        setLoading(true);

        const { data } = await v2.get<{
          partidas: Partida[];
          pagina: number;
          paginas: number;
          proximo_sorteio: string;
        }>(`/partidas/${user?.pos.id}/?pagina=${pag || pagina}`);

        setPagina(data.pagina);
        setMaxPagina(data.paginas || 1);
        setLoading(false);
        setProximo(data.proximo_sorteio);
        setBilhetes(data.partidas || []);
      } catch (err) {
        setLoading(false);
        if (err?.response?.data?.details) Alert.alert('Super Sorte', err?.response?.data?.details);
        else Alert.alert('Erro Interno', 'Historico não encontrado.');
      }
    },
    [pagina, user]
  );

  const mountScreen = useCallback(() => {
    setBilhetes([]);
    handleGetSorteio();
  }, [handleGetSorteio]);

  useEffect(() => {
    mountScreen();
  }, [mountScreen]);

  const handleReplay = useCallback(
    async (sorteio: string) => {
      try {
        const { data } = await v2.post<{ details: string }>(`/replay/${user?.pos.id}/`, {
          codigo: sorteio
        });
        setLoading(true);
        Alert.alert('Super Sorte', data.details || 'Replay solicitado com sucesso.');
      } catch (err) {
        if (err?.response?.data?.details) Alert.alert('Super Sorte', err?.response?.data?.details);
        else Alert.alert('Erro Interno', 'Falha ao solicitar replay.');
      }
      mountScreen();
      setLoading(false);
    },
    [mountScreen, user?.pos.id]
  );

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
          Histórico de Sorteios
        </Text>
      </Layout>
      <Layout style={buttonRow}>
        <Input
          style={search}
          onChangeText={setSorteio}
          value={sorteio}
          keyboardType="decimal-pad"
          placeholder="Código do Sorteio"
        />
        <Button
          style={button}
          onPress={() => handleReplay(sorteio)}
          accessoryLeft={() => <Ionicons style={{ color: '#fff' }} name="tv" />}
        >
          Solicitar Replay
        </Button>
      </Layout>
      <Layout>
        <List
          refreshControl={<RefreshControl refreshing={loading} onRefresh={mountScreen} />}
          persistentScrollbar={true}
          style={{}}
          contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 5 }}
          data={[...(bilhetes || []), { fake: 'bordaItem00' }, { fake: 'bbordaItem01' }, { fake: 'bbordaItem02' }]}
          renderItem={(info) => (
            <RenderItem proximo={proximo} item={info.item} loading={loading} onReplay={handleReplay} />
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

export default Sorteios;
