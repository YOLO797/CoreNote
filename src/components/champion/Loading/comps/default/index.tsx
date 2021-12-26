import React from 'react';
import './index.less';

export default () => {
  return (
    <div className="cp-loading-default">
      <svg height="100%" width="100%">
        <circle cx="50" cy="50" r="45" className="cp-loading-default-circle" />
      </svg>
    </div>
  );
};
