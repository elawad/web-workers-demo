import resizeFile from './resize';

onmessage = async (event) => {
  const { name, file } = event.data;
  const image = await resizeFile(file);

  postMessage({ name, image });
};
