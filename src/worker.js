import resize from './resize';

onmessage = async (event) => {
  const { name, file } = event.data;

  const image = await resize(file);

  postMessage({ name, image });
};
