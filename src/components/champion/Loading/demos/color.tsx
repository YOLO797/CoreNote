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
      <Loading color="red" size="small" />
      <Loading color="yellow" size="small" />
      <Loading color="green" size="small" />
    </div>
  );
};
