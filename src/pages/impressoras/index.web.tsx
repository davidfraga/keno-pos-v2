import React, { useCallback, useEffect, useState } from 'react';
import { Layout, Text, Button, Select, SelectItem } from '@ui-kitten/components';
import { DataTable } from 'react-native-paper';
import { main, button, title, textCenter } from './styles';
import { tableTitle, fontTableTitle, fontTableBody } from '../../components/Table/styles';
import { usePrinter } from '../../context/printer';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { useSettings } from '../../context/settings';
const BleManager = {
  start: async () => {},
  scan: async () => {},
  stopScan: async () => {},
  getDiscoveredPeripherals: async () => [],
  getConnectedPeripherals: async () => [],
  getBondedPeripherals: async () => [],
};
import { printerType, printerTypes } from '../../templates/universal';
import { testPrint } from '../../templates/test';
import { ScrollView } from 'react-native';

export const Impressoras: React.FC = () => {
  const { printerData, currentPrinter, connectPrinter } = usePrinter();
  const { driver, setDriver } = useSettings();
  const [devices, setDevices] = useState<PrinterData[]>(printerData ? [printerData] : []);
  const [loading, setLoading] = useState(false);

  const currentAddress = printerData?.address || '';

  const toggleDriver = useCallback((driver: printerType) => setDriver(driver), [setDriver]);

  useEffect(() => {
    async function StartBle() {
      setLoading(true);
      await BleManager.start();
      setLoading(false);
    }

    StartBle();
  }, []);

  const handleFetchDevices = useCallback(async () => {
    if (!driver.includes('bluetooth')) return;

    setLoading(true);

    await BleManager.scan([], 5, true);
    await BleManager.stopScan();

    const descobertos = (await BleManager.getDiscoveredPeripherals()) || [];
    const conectados = (await BleManager.getConnectedPeripherals([])) || [];
    const pareados = (await BleManager.getBondedPeripherals()) || [];

    const devices = [...pareados, ...descobertos, ...conectados];

    const parsedDevices = devices.map((device) => ({ address: device.id, name: device.name } as PrinterData));

    setDevices(parsedDevices || []);
    setLoading(false);
  }, [driver]);

  const handleConnectDevice = useCallback(
    (device: PrinterData) => {
      connectPrinter(device);
    },
    [connectPrinter]
  );

  return (
    <ScrollView>
      <Layout>
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
              onPress={() => testPrint(driver, currentPrinter)}
              style={button}
            />
          )}
        />
        <Layout style={main} level={'1'}>
          <Layout style={title}>
            <Text style={textCenter} category="h4">
              Selecionar Impressora:
            </Text>
            <Layout
              style={{
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Button disabled={loading || !driver.includes('bluetooth')} onPress={handleFetchDevices} style={button}>
                Buscar
              </Button>
              <Layout style={{ alignContent: 'center', alignItems: 'center' }}>
                <Select
                  style={{ width: 150 }}
                  placeholder={driver}
                  label={(evaProps: any) => <Text {...evaProps}>Driver:</Text>}
                  onSelect={(data) => {
                    if (Array.isArray(data)) return;
                    toggleDriver(printerTypes[data.row]);
                  }}
                >
                  {printerTypes ? (
                    <>
                      {printerTypes.map((type) => {
                        return (
                          <SelectItem key={`select_${type}`} title={(evaProps) => <Text {...evaProps}>{type}</Text>} />
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                </Select>
              </Layout>
            </Layout>
          </Layout>
          <Layout>
            <DataTable>
              <DataTable.Header style={tableTitle}>
                <DataTable.Title>
                  <Text style={fontTableTitle}>Dispositivo</Text>
                </DataTable.Title>
                <DataTable.Title numeric>
                  <Text style={fontTableTitle}>Mac Address</Text>
                </DataTable.Title>
                <DataTable.Title numeric>
                  <Text style={fontTableTitle}>Conectado</Text>
                </DataTable.Title>
              </DataTable.Header>
              {driver.includes('bluetooth') &&
                devices.map((device) => {
                  const connected = device.address === currentAddress;
                  return (
                    <DataTable.Row key={device.address}>
                      <DataTable.Cell>
                        <Text style={fontTableBody}>{device.name}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <Text style={fontTableBody}>{device.address}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <Button
                          style={button}
                          status={connected ? 'success' : 'primary'}
                          onPress={connected ? () => ({}) : () => handleConnectDevice(device)}
                          accessoryLeft={() => (
                            <Ionicons
                              color="#ffff"
                              size={22}
                              name={connected ? 'checkmark-circle-outline' : 'swap-horizontal-outline'}
                            />
                          )}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })}
            </DataTable>
          </Layout>
        </Layout>
      </Layout>
    </ScrollView>
  );
};

export default Impressoras;
