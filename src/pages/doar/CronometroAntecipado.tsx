import React, { useState } from 'react';
import { Text, TextProps } from '@ui-kitten/components';
import { differenceInSeconds, addSeconds } from 'date-fns';
import { useInterval } from '../../utils/useInterval';

interface Props extends TextProps {
  targetDate?: Date;
  serverDate?: Date;
}

const CronometroAntecipado: React.FC<Props> = ({ targetDate, serverDate, ...textProps }) => {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount((c) => c + 1);
  }, 1000);

  if (!targetDate || !serverDate) {
    return <Text {...textProps}>...</Text>;
  }

  const dSecond = differenceInSeconds(targetDate, addSeconds(serverDate, count));

  if (dSecond < 0) {
    return <Text {...textProps}>---</Text>;
  }

  const second = dSecond % 60;
  const minute = Math.floor(dSecond / 60) % 60;
  const hour = Math.floor(Math.floor(dSecond / 60) / 60) % 24;
  const days = Math.floor(Math.floor(Math.floor(dSecond / 60) / 60) / 24);

  let text = '';
  if (days > 0) {
    text = `${days}d ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  } else {
    const totalHours = Math.floor(Math.floor(dSecond / 60) / 60);
    text = `${totalHours.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  }

  return <Text {...textProps}>{text}</Text>;
};

export default CronometroAntecipado;
