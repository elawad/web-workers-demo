import { useEffect, useRef } from 'react';

import loadingImg from './loading.svg';
import './index.css';

type ImageProps = {
  size: number;
  dpr: number;
  image?: ImageBitmap;
  isDone?: boolean;
};

function Image({ size, dpr, image, isDone }: ImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!image) return;

    const [w, h] = imgSizes(image, dpr);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.scale(dpr, dpr);
    ctx.drawImage(image, 0, 0, w, h);
  }, [image, dpr]);

  const [w, h] = image ? imgSizes(image, dpr) : [size, size];

  return (
    <div className={`image${isDone ? '' : ' loading'}`}>
      {!isDone && <img src={loadingImg} alt="loading" />}

      <canvas ref={canvasRef} style={{ width: `${w}px`, height: `${h}px` }} />
    </div>
  );
}

function imgSizes(image: ImageBitmap, dpr: number) {
  const w = image.width / dpr;
  const h = image.height / dpr;
  return [w, h] as const;
}

export default Image;
export type { ImageProps };
