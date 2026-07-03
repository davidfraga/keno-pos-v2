import React, { FC } from 'react';

// Execute a BackgroundFetch.scheduleTask stub for Web
export const scheduleTask = async (name: string) => {
  console.log(`[Web Stub] scheduleTask called for ${name}`);
}

const BackgroundFetchHandler: FC<any> = ({children}) => {
  return (
    <>
      {children}
    </>
  );
};

export default BackgroundFetchHandler;
