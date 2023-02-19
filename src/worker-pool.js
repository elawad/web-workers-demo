import resize from './resize';

const workers = [];
const callbacks = new Map();
let index = -1;

async function start(id, file, size, cb) {
  const total = workers.length;

  if (!total) {
    const image = await resize(file, size);
    cb(id, image);
    return;
  }

  index = index + 1 >= total ? 0 : index + 1;

  callbacks.set(id, cb);
  workers[index].postMessage({ id, file, size });
}

function setCount(c = 0) {
  const max = counts.at(-1);
  const count = c > max ? max : Math.max(0, c);

  // Remove Workers
  while (count < workers.length) {
    const worker = workers.pop();
    worker.terminate();
  }

  // Add Workers
  while (count > workers.length) {
    const worker = new Worker(new URL('./worker', import.meta.url), {
      type: 'module',
    });

    worker.onerror = console.error;
    worker.onmessage = (event) => {
      const { id, image } = event.data;
      const cb = callbacks.get(id);
      if (!cb) return;

      cb(id, image);
      callbacks.delete(id);
    };
    workers.push(worker);
  }
}

function reset(count) {
  setCount(count);
  callbacks.clear();
}

const counts = (() => {
  const limit = navigator.hardwareConcurrency;
  const sqrt = Math.ceil(Math.sqrt(limit) + 1);
  const keys = [...Array(sqrt).keys()];
  return keys.map((i) => 2 ** i).filter((i) => i <= limit);
})();

export { start, setCount, reset, counts };
