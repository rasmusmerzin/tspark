import React from 'react';
import './Particle.css';

interface Props {
  posX: number;
  posY: number;
}

const Particle: React.FC<Props> = ({ posX, posY }) => {
  return <div
    className='particle'
    style={{
      left: posX *100 +'vh',
      bottom: posY *100 +'vh'
    }}
  ></div>;
};

export default Particle;
