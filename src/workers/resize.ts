import type { MsgWork } from '../types';

async function resize({ file, size }: MsgWork) {
  const rq: ImageBitmapOptions = { resizeQuality: 'high' };
  let image = await createImageBitmap(file, rq).catch(console.error);
  if (!image) return;

  const ratio = imgRatio(image);
  let [w, h] = imgSizes(image, size);
  let rotate = false;

  // Resize using step-down for better image quality.
  while (h >= size) {
    if (rotate) {
      [w, h] = [h, w];
    }

    const opts: ImageBitmapOptions = { resizeWidth: w, resizeHeight: h, ...rq };
    image = await createImageBitmap(image, opts);

    if (ratio !== imgRatio(image)) {
      rotate = true;
      continue;
    }

    [w, h] = imgSizes(image, size);
  }

  return image;
}

function imgSizes(image: ImageBitmap, size: number) {
  const { width, height } = image;
  if (height === size) {
    return [0, 0] as const; // End
  }

  // Step size
  const factor = 0.5;
  let w = width * factor;
  let h = height * factor;

  // Minimum size
  if (h < size) {
    w = width / (height / size);
    h = size;
  }

  return [w, h] as const;
}

function imgRatio(image: ImageBitmap) {
  const ratio = image.width / image.height;
  return Number.parseInt(ratio.toString());
}

export default resize;
