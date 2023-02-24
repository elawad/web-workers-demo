import resize from './resize';

const WORKERS = new Array(); // worker pool to pull from
const QUEUE = new Map(); // all tasks, running or waiting
let WORKERS_MAX = 0; // # of workers selected
let WORKERS_SET = 0; // # of workers created
let IN_PROGRESS = 0; // # of tasks running

async function start({ id, file, size, cb }) {
  const maxRunning = !!IN_PROGRESS && IN_PROGRESS >= WORKERS_MAX;
  const maxWorkers = !!WORKERS_SET && WORKERS_SET >= WORKERS_MAX;

  // Add waiting in queue
  if (maxRunning) {
    QUEUE.set(id, { file, size, cb, waiting: true });
    return;
  }

  IN_PROGRESS += 1;

  // Use main thread
  if (!WORKERS_MAX) {
    QUEUE.delete(id);
    const image = await resize(file, size);
    cb(id, image);
    next();
    return;
  }

  // Reached workers limit, use an existing worker
  if (maxWorkers) {
    const worker = WORKERS.shift();
    QUEUE.set(id, { file, size, cb });
    worker.postMessage({ id, file, size });
    return;
  }

  // Create a new worker
  WORKERS_SET += 1;

  const worker = new Worker(new URL('./worker', import.meta.url), {
    type: 'module',
  });

  worker.onmessage = (event) => {
    const { id, image } = event.data;
    const data = QUEUE.get(id);
    data?.cb(id, image);
    QUEUE.delete(id);
    next(event.target); // Pass current worker for reuse
  };

  worker.onerror = (event) => {
    console.error(event);
    next(event.target); // Pass current worker for reuse
  };

  // Use new worker
  QUEUE.set(id, { file, size, cb });
  worker.postMessage({ id, file, size });
}

function next(worker) {
  if (worker) WORKERS.push(worker);

  IN_PROGRESS = Math.max(0, IN_PROGRESS - 1);

  // Check for any waiting in queue
  const entry = [...QUEUE.entries()].find(([, d]) => d.waiting);
  if (entry) {
    const [id, data] = entry;
    QUEUE.set(id, { ...data, waiting: false });
    start({ id, ...data });
    return;
  }

  // None waiting or running, end workers.
  if (!IN_PROGRESS) reset();
}

function setCount(c = 0) {
  const max = counts.at(-1);
  const count = Math.min(max, Math.max(0, c));

  WORKERS_MAX = count;
}

function reset() {
  while (WORKERS.length) {
    const worker = WORKERS.pop();
    worker.terminate();
  }

  QUEUE.clear();
  WORKERS_MAX = 0;
  WORKERS_SET = 0;
  IN_PROGRESS = 0;
}

// Use client's CPU limit for # of worker selection
const counts = (() => {
  const limit = navigator.hardwareConcurrency;
  const log2 = Math.floor(Math.log2(limit));
  const keys = [...Array(log2).keys()];
  const pow2 = keys.map((i) => Math.pow(2, i + 1));
  return [1, ...pow2];
})();

export { start, setCount, reset, counts };
