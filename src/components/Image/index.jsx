import { useState, useEffect, useRef } from 'react';

import loadingImg from '../../assets/loading.svg';
import './Image.css';

function Image({ image, size }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  }, [image]);

  const done = image !== undefined;
  const w = image?.width ?? size;
  const h = image?.height ?? size;

  return (
    <div className={`image ${done ? 'done' : ''}`}>
      <img src={loadingImg} className="loading" />
      <canvas ref={canvasRef} style={{ width: `${w}px`, height: `${h}px` }} />
    </div>
  );
}

export default Image;