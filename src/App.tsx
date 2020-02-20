import React from 'react';
import Particle from './Particle';
import './App.css';


interface Physics {
  posX: number;
  posY: number;
  velX: number;
  velY: number;
}


const App: React.FC = () => {
  const [children, setChildren] = React.useState<Physics[]>([]);

  return <div
    id="app"
    onClick={e => {
      setTimeout(() => setChildren(val => val.map(node => {
        node.posX += node.velX;
        node.posY += node.velY;
        return node;
      })));
      setChildren([...children, {
        posX: e.clientX /window.innerHeight,
        posY: (window.innerHeight -e.clientY) /window.innerHeight,
        velX: 0,
        velY: -.01
      }]);
    }}
  >
    {children.map((node, i) => <Particle
      posX={node.posX}
      posY={node.posY}
      key={i}
    />)}
  </div>;
}

export default App;
