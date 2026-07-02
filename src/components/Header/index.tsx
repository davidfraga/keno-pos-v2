import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TopNavigation, Button } from '@ui-kitten/components';
import React, { useCallback } from 'react';
import { useAuth } from '../../context/auth/auth';
import { version } from '../../../package.json';
import { useSettings } from '../../context/settings';

// import { Container } from './styles';

const Header: React.FC<{ RightIcon?: any }> = ({ RightIcon: LeftIcon }) => {
  const navigation: any = useNavigation();
  const { user } = useAuth();
  const { serverName, server } = useSettings();

  const handleToggleDrawer = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  const Hamburger = (props: any) => (
    <Button
      {...props}
      onPress={handleToggleDrawer}
      appearance="ghost"
      accessoryLeft={() => <FontAwesome size={25} name="bars" />}
    />
  );

  return (
    <TopNavigation
      style={{ paddingHorizontal: 15 }}
      accessoryLeft={Hamburger}
      accessoryRight={LeftIcon}
      alignment="center"
      subtitle={'' || user?.pos?.nome}
      title={`${serverName} ${version}r${server}`}
    />
  );
};

export default Header;
