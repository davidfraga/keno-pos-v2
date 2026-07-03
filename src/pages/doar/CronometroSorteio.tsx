import React, { useState } from 'react';
import { Text, TextProps } from '@ui-kitten/components';
import { useInterval } from '../../utils/useInterval';
import timerSort from './timesort';

interface Props extends TextProps {
  dataSort?: Date;
  dataServer?: Date;
  antecipado: boolean;
  sorteioSelecionado?: any;
}

const CronometroSorteio: React.FC<Props> = ({
  dataSort,
  dataServer,
  antecipado,
  sorteioSelecionado,
  ...textProps
}) => {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount((c) => c + 1);
  }, 1000);

  if (!dataSort || !dataServer) {
    return <Text {...textProps}>...</Text>;
  }

  const text = timerSort(
    dataSort,
    dataServer,
    count,
    antecipado,
    sorteioSelecionado
  );

  return <Text {...textProps}>{text}</Text>;
};

export default CronometroSorteio;
