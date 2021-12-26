import React from 'react';
import './style/index';

const isString = (children) => {
  if (typeof children === 'string') {
    return <span>{children}</span>;
  }
  return children;
};

const Button = ({ type, disabled, className, children }) => {
  const slot_content = isString(children);
  const btn_class_name = (type) => {
    let class_name = '';
    switch (type) {
      case 'primary':
        class_name = 'mk-btn mk-btn-primary';
        break;
      case 'info':
        class_name = 'mk-btn mk-btn-info';
        break;
      case 'warning':
        class_name = 'mk-btn mk-btn-warning';
        break;
      case 'danger':
        class_name = 'mk-btn mk-btn-danger';
        break;
      default:
        class_name = 'mk-btn mk-btn-default';
        break;
    }
    return class_name;
  };
  return (
    <button
      type={type}
      className={btn_class_name(className)}
      disabled={disabled}
    >
      {slot_content}
    </button>
  );
};
export default Button;

// import { First } from 'docs';

// export default () => <First title="First Demo123" />;
