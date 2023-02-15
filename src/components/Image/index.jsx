import { useState, useEffect, useRef } from 'react';

import ImgLoading from '../../assets/loading.svg';
import './Image.css';

function Image({ image }) {
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

  const done = image !== undefined;

  return (
    <div className={`image ${done ? 'done' : ''}`}>
      <img src={ImgLoading} className="loading" />
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Image;
