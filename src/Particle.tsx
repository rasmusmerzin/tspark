import React from 'react';
import './Particle.css';

interface Props {
  posX: number;
  posY: number;
  hue: number;
}

const Particle: React.FC<Props> = ({ posX, posY, hue }) => {
  return <div
    className='particle'
    style={{
      left: posX *100 +'vh',
      bottom: posY *100 +'vh',
      background: `hsl(${hue}, 100%, 66%)`
    }}
  ></div>;
};

export default Particle;
