import React from 'react';
import { Loading } from 'cp-ui';

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Loading size="small" />
      <Loading size="default" />
      <Loading size="large" />
    </div>
  );
};
