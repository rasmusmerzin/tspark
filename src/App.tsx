import React from 'react';
import Particle from './Particle';
import './App.css';


const unit = .05;
const idleTimeout = 10000;                  // milliseconds
const idleInterval = 5000;                  // milliseconds
const renderRate = 60;                      // per second
const inputInterval = 4;                    // renders
const gravity = 10 *unit /renderRate **2;   // per render^2
const sparkCount = 3;
const sparkForce = unit *.03;


interface Node {
  posX: number,
  posY: number,
  velX: number,
  velY: number,
  key: string
}

interface Touch {
  x: number,
  y: number
}

interface State {
  children: Node[],
  mouse: {
    x: number,
    y: number,
    on: boolean
  },
  touch: Touch[],
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
    touch: [],
    lastUserSpark: now(),
    lastIdleSpark: now()
  });

  const setTouch = (touch: Touch[]) => setState(state => {
    return {...state, touch};
  });

  const setMousePos = (x: number, y: number) => setState(state => {
    const newState = {...state};
    newState.mouse.x = x;
    newState.mouse.y = y;
    return newState;
  });

  const setMouseOn = (on: boolean, x?: number, y?: number) => setState(state => {
    const newState = {...state};
    newState.mouse.on = on;
    if (x !== undefined) newState.mouse.x = x;
    if (y !== undefined) newState.mouse.y = y;
    return newState;
  });

  const createSpark = (force?: boolean) => setState(state => {
    const newState = {...state};
    const timeString = String(now());
    const spark = (x: number, y: number, keyBody: string) => {
      for (let i=0; i < sparkCount; i++) {
        newState.children.push({
          posX: x /window.innerHeight,
          posY: (window.innerHeight -y) /window.innerHeight,
          velX: (Math.random() -.5) *sparkForce,
          velY: (Math.random() -.3) *sparkForce,
          key: keyBody +i
        });
      }
    };
    if (state.mouse.on || state.touch.length > 0 || force) {
      newState.lastUserSpark = now();
      for (const i in state.touch) {
        const t = state.touch[i];
        spark(t.x, t.y, timeString +String(i).padStart(2, '0'));
      }
      if (state.mouse.on) spark(state.mouse.x, state.mouse.y, timeString +String(state.touch.length).padStart(2, '0'));
    } else if (
      now() -state.lastUserSpark > idleTimeout &&
      now() -state.lastIdleSpark > idleInterval
    ) {
      newState.lastIdleSpark = now();
      spark(
        window.innerWidth *.5,
        window.innerHeight *.1,
        '00'
      );
    }
    return newState;
  });

  const renderNodes = () => setState(state => {
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
    let counter = 0;
    const ticker = setInterval(() => {
      renderNodes();
      counter = (counter +1) %inputInterval;
      if (counter === 0) createSpark();
    }, 1000 /renderRate);
    return () => clearInterval(ticker);
  }, []);

  return <div
    id="app"
    onMouseDown={e => setMouseOn(true, e.clientX, e.clientY)}
    onMouseMove={e => setMousePos(e.clientX, e.clientY)}
    onMouseUp={() => setMouseOn(false)}
    onTouchStart={e => {
      const touch: Touch[] = [];
      for (let i=0; i < e.touches.length; i++) {
        const item = e.touches.item(i);
        touch.push({ x: item.clientX, y: item.clientY });
      }
      setTouch(touch);
    }}
    onTouchMove={e => {
      const touch: Touch[] = [];
      for (let i=0; i < e.touches.length; i++) {
        const item = e.touches.item(i);
        touch.push({ x: item.clientX, y: item.clientY });
      }
      setTouch(touch);
    }}
    onTouchEnd={() => setTouch([])}
    onClick={() => createSpark(true)}
  >
    {state.children.map((node, i) => <Particle
      key={node.key}
      posX={node.posX}
      posY={node.posY}
      hue={-Math.abs(node.velY) *360 *66}
    />)}
  </div>;
}

export default App;
