import Button from './button';

const demo_style = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
};
export default () => (
  <div style={demo_style}>
    <Button className="default">老实人外部按钮组件</Button>
    <Button className="primary">老实人外部按钮组件</Button>
    <Button className="info">老实人外部按钮组件</Button>
    <Button className="warning">老实人外部按钮组件</Button>
    <Button className="danger">老实人外部按钮组件</Button>
  </div>
);
