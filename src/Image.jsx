import { useState, useEffect, useRef } from 'react';

import reactLogo from './assets/react.svg';
import './Image.css';

function Image({ image, isDone }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const { width: w, height: h } = image;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(image, 0, 0);
  }, [image]);

  return (
    <div className={`image ${isDone ? 'done' : ''}`}>
      <img src={reactLogo} className="logo" />
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Image;
