/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, FC } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import { useAuth } from '../context/auth/auth';
import { v2 } from './api';


// Execute a BackgroundFetch.scheduleTask
export const scheduleTask = async (name: string) => {
  try {
    await BackgroundFetch.scheduleTask({
      taskId: name,
      stopOnTerminate: false,
      enableHeadless: true,
      delay: 5000,                // milliseconds (5s)
      forceAlarmManager: true,   // more precise timing with AlarmManager vs default JobScheduler
      periodic: true            // Fire once only.
    });
  } catch (e) {
    console.warn('[BackgroundFetch] scheduleTask fail', e);
  }
}

const BackgroundFetchHandler: FC = ({children}) => {
  const {user} = useAuth();

  /// BackgroundFetch event-handler.
  /// All events from the plugin arrive here, including #scheduleTask events.
  const onBackgroundFetchEvent = async (taskId: string) => {
    if(!user) return;
    if(user.nome_server.toLocaleLowerCase() === "pradelivery") return;
    
    if (taskId === 'react-native-background-fetch') {
      try {
        await v2.get('/ping_pos/');
      } catch (e) {
        console.warn('[BackgroundFetch] scheduleTask falied', e);
      }
    }

    BackgroundFetch.finish(taskId);
  };

  const onBackgroundFetchTimeout = async (taskId: string) => {
    BackgroundFetch.finish(taskId);
  };

  const init = async () => {
    const status = await BackgroundFetch.configure({
      minimumFetchInterval: 15,      // <-- minutes (15 is minimum allowed)
      forceAlarmManager: true,      // <-- Set true to bypass JobScheduler.
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
      requiresCharging: false,       // Default
      requiresDeviceIdle: false,     // Default
      requiresBatteryNotLow: false,  // Default
      requiresStorageNotLow: false,  // Default
    }, onBackgroundFetchEvent, onBackgroundFetchTimeout);
  }; 

  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {children}
    </>
  );
};

export default BackgroundFetchHandler;