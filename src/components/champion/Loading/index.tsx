import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './index.less';
import Default from './comps/default';

export type ILoadingTypes = {
  /**
   * @description 类型
   * @default 'default'
   */
  type?: 'default' | 'circle';
  /**
   * @description 所用时间(单位：ms)
   * @default 2000
   */
  during?: number;
  /**
   * @description 宽度
   * @default 100
   */
  width?: number | string;
  /**
   * @description 尺寸
   */
  size?: 'small' | 'default' | 'large';
  /**
   * @description loading主体的颜色
   * @default '#000''
   */
  color?: string;
};

const getWidthForSizeObj = {
  small: 50,
  default: 100,
  large: 200,
};

const getLoadings = (type: ILoadingTypes['type']) => {
  switch (type) {
    case 'default':
      return <Default />;
    default:
      return <Default />;
  }
};

const Loading: React.FC<ILoadingTypes> = ({
  type = 'default',
  during = 2000,
  width = 100,
  size,
  color = '#000',
}) => {
  const [scale, setScale] = useState<number>(1);
  const [_width, _setWidth] = useState<number>(100);
  useEffect(() => {
    let w = width;
    if (size) w = getWidthForSizeObj[size];
    else w = typeof width === 'number' ? width : parseInt(width);
    if (w) {
      setScale(w / 100);
      _setWidth(w);
    }
  }, [width]);
  return (
    <div
      className="cp-ui-loading"
      style={
        {
          '--time': during,
          '--color': color,
          width: _width,
          height: _width,
        } as any
      }
    >
      <div
        className="cp-ui-loading-ctr"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {getLoadings(type)}
      </div>
    </div>
  );
};

export default Loading;
