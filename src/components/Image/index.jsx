import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import loadingImg from '../../assets/loading.svg';
import './Image.css';

const propTypes = {
  size: PropTypes.number.isRequired,
  image: PropTypes.object, // ImageBitmap type,
};

function Image({ size, image }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!image) return;

    const [w, h, dpr] = getSizes(image);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.scale(dpr, dpr);
    ctx.drawImage(image, 0, 0, w, h);
  }, [image]);

  const done = image !== undefined;
  const [w, h] = getSizes(image) ?? [size, size];

  return (
    <div className={`image ${done ? 'done' : ''}`}>
      <img src={loadingImg} className="loading" alt="Loading" />
      <canvas ref={canvasRef} style={{ width: `${w}px`, height: `${h}px` }} />
    </div>
  );
}

function getSizes(image) {
  if (!image) return;

  const dpr = window.devicePixelRatio;
  const w = image.width / dpr;
  const h = image.height / dpr;
  return [w, h, dpr];
}

Image.propTypes = propTypes;
export default Image;