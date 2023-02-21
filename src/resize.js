async function resize(file, size) {
  const original = await createImageBitmap(file).catch(console.error);

  if (!original) return null;

  let image = original;
  let [w, h] = stepSizes(image, size);

  // Resize using step-down for better image quality.
  while (h > size) {
    image = await createImageBitmap(image, opts(w, h));
    [w, h] = stepSizes(image, size);
  }

  // Final resize to fit dimensions.
  if (h <= size) {
    [w, h] = stepSizes(image, size, true);
    image = await createImageBitmap(image, opts(w, h));
  }

  return image;
}

function stepSizes(image, size, isFinal) {
  if (isFinal) {
    const w = image.width / (image.height / size);
    const h = size;
    return [w, h];
  }

  const factor = 0.5;
  const w = image.width * factor;
  const h = image.height * factor;
  return [w, h];
}

function opts(w, h) {
  return {
    resizeWidth: w,
    resizeHeight: h,
    resizeQuality: 'high',
  };
}

export default resize;
