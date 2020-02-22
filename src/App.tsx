import React from 'react';
import Particle from './Particle';
import './App.css';


const unit = .1;
const renderRate = 60;                      // per second
const gravity = 10 *unit /renderRate **2;   // per render^2


interface Physics {
  posX: number;
  posY: number;
  velX: number;
  velY: number;
}

interface State {
  children: Physics[],
  mouse: {
    x: number,
    y: number,
    on: boolean
  }
}


const App: React.FC = () => {
  const [state, setState] = React.useState<State>({
    children: [],
    mouse: {
      x: 0,
      y: 0,
      on: false
    }
  });

  const setMousePos = (x: number, y: number) => setState(state =>{
    const newState = {...state};
    newState.mouse.x = x;
    newState.mouse.y = y;
    return newState;
  });

  const setMouseOn = (on: boolean) => setState(state =>{
    const newState = {...state};
    newState.mouse.on = on;
    return newState;
  });

  const createSpark = (force: boolean) => setState(state => {
    const newState = {...state};
    if (state.mouse.on || force) newState.children.push({
      posX: state.mouse.x /window.innerHeight,
      posY: (window.innerHeight -state.mouse.y) /window.innerHeight,
      velX: 0,
      velY: 0
    });
    return newState;
  });

  const renderPhysics = () => setState(state => {
    const newState = {...state};
    newState.children = state.children.map(node => {
      node.velY -= gravity;
      node.posX += node.velX;
      node.posY += node.velY;
      return node;
    }).filter(node => node.posY > 0);
    return newState;
  });

  React.useEffect(() => {
    const ticker = setInterval(renderPhysics, 1000 /renderRate);
    return () => clearInterval(ticker);
  }, []);

  React.useEffect(() => {
    const ticker = setInterval(createSpark, 100);
    return () => clearInterval(ticker);
  }, []);

  return <div
    id="app"
    onMouseMove={e => setMousePos(e.clientX, e.clientY)}
    onMouseDown={() => setMouseOn(true)}
    onMouseUp={() => setMouseOn(false)}
    onClick={() => createSpark(true)}
  >
    {state.children.map((node, i) => <Particle
      posX={node.posX}
      posY={node.posY}
      key={i}
    />)}
  </div>;
}

export default App;
