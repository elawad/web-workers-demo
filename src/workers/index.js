import resize from './resize';

const WORKERS = new Array();
const QUEUE = new Map();
let WORKERS_MAX = 0;
let WORKERS_SET = 0;

async function start({ id, file, size, cb }) {
  const inFlight = [...QUEUE.values()].filter((v) => !v.waiting).length;
  const maxFlight = !!inFlight && inFlight >= WORKERS_MAX;
  const maxWorkers = !!WORKERS_SET && WORKERS_SET >= WORKERS_MAX;

  QUEUE.set(id, { file, size, cb });

  // Set waiting in queue
  if (maxFlight) {
    QUEUE.set(id, { file, size, cb, waiting: true });
    return;
  }

  // Use main thread
  if (!WORKERS_MAX) {
    const image = await resize(file, size);
    cb(id, image);
    QUEUE.delete(id);
    next();
    return;
  }

  // Use existing worker
  if (maxWorkers) {
    const worker = WORKERS.shift();
    worker.postMessage({ id, file, size });
    return;
  }

  // Use new worker
  WORKERS_SET += 1;
  const worker = new Worker(new URL('./worker', import.meta.url), {
    type: 'module',
  });

  worker.onmessage = (event) => {
    const { id, image } = event.data;
    QUEUE.get(id)?.cb(id, image);
    QUEUE.delete(id);
    WORKERS.push(worker);
    next();
  };

  worker.onerror = (event) => {
    console.error(event);
    WORKERS.push(worker);
    next();
  };

  worker.postMessage({ id, file, size });
}

function next() {
  // Start next waiting in queue
  const entry = [...QUEUE.entries()].find(([, v]) => v.waiting);
  if (entry) {
    const [id, val] = entry;
    QUEUE.delete(id);
    start({ id, ...val });
    return;
  }

  // End of queue and none waiting
  if (!QUEUE.size) reset();
}

function reset() {
  while (WORKERS.length) {
    const worker = WORKERS.pop();
    worker.terminate();
  }

  QUEUE.clear();
  WORKERS_MAX = 0;
  WORKERS_SET = 0;
}

function setCount(c = 0) {
  const max = counts.at(-1);
  const count = Math.min(max, Math.max(0, c));
  WORKERS_MAX = count;
}

// Limit worker # selection by CPU
const counts = (() => {
  const cpus = navigator.hardwareConcurrency;
  const log2 = Math.floor(Math.log2(cpus));
  const keys = [...Array(log2).keys()];
  const pow2 = keys.map((i) => Math.pow(2, i + 1));
  return [1, ...pow2];
})();

export { start, reset, setCount, counts };
