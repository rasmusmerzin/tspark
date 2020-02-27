import React from 'react';
import Particle from './Particle';
import './App.css';


const unit = .05;
const idleTimeout = 10000;                  // milliseconds
const idleInterval = 5000;                  // milliseconds
const inputRate = 10;                       // per second
const renderRate = 60;                      // per second
const gravity = 10 *unit /renderRate **2;   // per render^2
const sparkCount = 3;
const sparkForce = unit *.05;


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
  },
  lastUserSpark: number,
  lastIdleSpark: number
}


const now = () => (new Date()).getTime();


const App: React.FC = () => {
  const [state, setState] = React.useState<State>({
    children: [],
    mouse: {
      x: 0,
      y: 0,
      on: false
    },
    lastUserSpark: now(),
    lastIdleSpark: now()
  });

  const setMousePos = (x: number, y: number) => setState(state =>{
    const newState = {...state};
    newState.mouse.x = x;
    newState.mouse.y = y;
    return newState;
  });

  const setMouseOn = (on: boolean, x?: number, y?: number) => setState(state =>{
    const newState = {...state};
    newState.mouse.on = on;
    if (x !== undefined) newState.mouse.x = x;
    if (y !== undefined) newState.mouse.y = y;
    return newState;
  });

  const createSpark = (force: boolean) => setState(state => {
    const newState = {...state};
    const spark = (x: number, y: number) => {
      for (let i=0; i < sparkCount; i++) {
        newState.children.push({
          posX: x /window.innerHeight,
          posY: (window.innerHeight -y) /window.innerHeight,
          velX: (Math.random() -.5) *sparkForce,
          velY: (Math.random() -.3) *sparkForce
        });
      }
    };
    if (state.mouse.on || force) {
      newState.lastUserSpark = now();
      spark(state.mouse.x, state.mouse.y);
    } else if (
      now() -state.lastUserSpark > idleTimeout &&
      now() -state.lastIdleSpark > idleInterval
    ) {
      newState.lastIdleSpark = now();
      spark(
        window.innerWidth *.5,
        window.innerHeight *.1
      );
    }
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
    const ticker = setInterval(createSpark, 1000 /inputRate);
    return () => clearInterval(ticker);
  }, []);

  return <div
    id="app"
    onMouseMove={e => setMousePos(e.clientX, e.clientY)}
    onMouseDown={e => setMouseOn(true, e.clientX, e.clientY)}
    onMouseUp={() => setMouseOn(false)}
    onTouchMove={e => setMousePos(e.touches[0].clientX, e.touches[0].clientY)}
    onTouchStart={e => setMouseOn(true, e.touches[0].clientX, e.touches[0].clientY)}
    onTouchEnd={() => setMouseOn(false)}
    onClick={() => createSpark(true)}
  >
    {state.children.map((node, i) => <Particle
      posX={node.posX}
      posY={node.posY}
      hue={-Math.abs(node.velY) *360 *renderRate}
      key={i}
    />)}
  </div>;
}

export default App;
