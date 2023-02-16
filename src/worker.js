import resize from './resize';

onmessage = async (event) => {
  const { name, file, size } = event.data;

  const image = await resize({ file, size });

  postMessage({ name, image });
};
