import { useEffect, useRef, useState } from 'react';

import './index.css';

import loadingImg from './loading.svg';

type ImageProps = {
  size: number;
  dpr: number;
  image?: ImageBitmap;
  isDone?: boolean;
};

function Image({ size, dpr, image, isDone }: ImageProps) {
  const [sizes, setSizes] = useState<[number, number]>([size, size]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!image || !canvas || !ctx) return;

    const { width, height } = image;
    const w = width / dpr;
    const h = height / dpr;
    canvas.width = width;
    canvas.height = height;
    ctx.scale(dpr, dpr);
    ctx.drawImage(image, 0, 0, w, h);
    image.close();
    setSizes([w, h]);
  }, [dpr, image]);

  const [w, h] = sizes;

  return (
    <div className={`image${isDone ? '' : ' loading'}`}>
      {!isDone && <img src={loadingImg} alt="loading" />}

      <canvas ref={canvasRef} style={{ width: `${w}px`, height: `${h}px` }} />
    </div>
  );
}

export default Image;
export type { ImageProps };
