import resize from './resize';

onmessage = async (event) => {
  const { id, file, size } = event.data;

  const image = await resize(file, size);

  postMessage({ id, image }, [image]);
};
