import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import {  footerContainer, footerControl } from './styles';
import { Layout, Button, Card } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';
import { Modal } from 'react-native-paper';

type props = {
  show: boolean;
  width?: string | number;
  footer?: RenderProp<ViewProps>;
  onClose: () => void;
};

const Footer: React.FC<any> = ({ props, onClose }) => (
  <View {...props} style={[props?.style, footerContainer]}>
    <Button onPress={onClose} style={footerControl} status="basic" size="small">
      Fechar
    </Button>
  </View>
);

const ModalBase: React.FC<props> = ({
  children,
  show,
  width,
  footer,
  onClose
}) => {
  const FooterEl = useMemo<RenderProp<ViewProps>>(
    () => footer || ((props) => <Footer props={props} onClose={onClose} />),
    [footer, onClose]
  );

  return (
    <Modal
      visible={!!show}
      onDismiss={onClose}
      style={{ width: width, marginHorizontal: '5%' }}
    >
      <Layout>
        <Card disabled={true} footer={FooterEl}>
          {children}
        </Card>
      </Layout>
    </Modal>
  );
};

export default ModalBase;
