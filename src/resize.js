const HEIGHT = 200; // Match css var --size.

async function resizeFile(file) {
  const original = await createImageBitmap(file).catch(() => null);
  if (!original) return null;

  let image = original;
  let [w, h] = stepSizes(image);

  // Resize using step-down for better image quality.
  while (h > HEIGHT) {
    image = await createImageBitmap(image, opts(w, h));
    [w, h] = stepSizes(image);
  }

  // Final resize to fit dimensions.
  if (h <= HEIGHT) {
    [w, h] = stepSizes(image, true);
    image = await createImageBitmap(image, opts(w, h));
  }

  return image;
}

function stepSizes(image, isFinal) {
  if (isFinal) {
    const w = Math.round(image.width / (image.height / HEIGHT));
    const h = HEIGHT;
    return [w, h];
  }

  const factor = 0.75;
  const w = Math.round(image.width * factor);
  const h = Math.round(image.height * factor);
  return [w, h];
}

function opts(w, h) {
  return {
    resizeWidth: w,
    resizeHeight: h,
    resizeQuality: 'high',
  };
}

export default resizeFile;
