async function resize(file, size) {
  let image = await createImageBitmap(file).catch(console.error);

  if (!image) return null;

  let [w, h] = stepSizes(image, size);

  // Resize using step-down for better image quality.
  while (h >= size) {
    const opts = { resizeWidth: w, resizeHeight: h, resizeQuality: 'high' };
    image = await createImageBitmap(image, opts);

    [w, h] = stepSizes(image, size);
  }

  return image;
}

function stepSizes(image, size) {
  if (image.height === size) return []; // end

  // Step size
  const factor = 0.5;
  let w = image.width * factor;
  let h = image.height * factor;

  // Minimum size
  if (h < size) {
    w = image.width / (image.height / size);
    h = size;
  }

  return [w, h];
}

export default resize;
