import type { MsgDone, MsgWork } from '../types';
import resize from './resize';

const WORKERS = new Array<Worker>();
const QUEUE = new Map<Queue['id'], Queue>();
let WORKERS_MAX = 0;
let WORKERS_SET = 0;

type Data = MsgWork & { onDone: (msg: MsgDone) => void };
type Queue = Data & { isWait?: boolean };

async function start(data: Data) {
  const inFlight = [...QUEUE.values()].filter((v) => !v.isWait).length;
  const maxFlight = !!inFlight && inFlight >= WORKERS_MAX;
  const maxWorkers = !!WORKERS_SET && WORKERS_SET >= WORKERS_MAX;

  const { id, file, size, onDone } = data;
  const msg: MsgWork = { id, file, size };

  QUEUE.set(id, data);

  // Set waiting in queue
  if (maxFlight) {
    QUEUE.set(id, { ...data, isWait: true });
    return;
  }

  // Use main thread
  if (!WORKERS_MAX) {
    const image = await resize(msg);
    onDone({ id, image });
    QUEUE.delete(id);
    next();
    return;
  }

  // Use existing worker
  if (maxWorkers) {
    const worker = WORKERS.shift();
    worker?.postMessage(msg);
    return;
  }

  // Use new worker
  WORKERS_SET += 1;
  const worker = new Worker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
  });

  worker.onmessage = (event: MessageEvent<MsgDone>) => {
    const { id } = event.data;
    QUEUE.get(id)?.onDone(event.data);
    QUEUE.delete(id);
    WORKERS.push(worker);
    next();
  };

  worker.onerror = (event) => {
    console.error(event);
    WORKERS.push(worker);
    next();
  };

  worker.postMessage(msg);
}

function next() {
  // Start next waiting in queue
  const entry = [...QUEUE.values()].find((v) => v.isWait);
  if (entry) {
    QUEUE.delete(entry.id);
    const { isWait, ...data } = entry;
    start(data);
    return;
  }

  // End of queue and none waiting
  if (!QUEUE.size) reset();
}

function reset() {
  while (WORKERS.length) {
    const worker = WORKERS.pop();
    worker?.terminate();
  }

  QUEUE.clear();
  WORKERS_MAX = 0;
  WORKERS_SET = 0;
}

function setCount(c: number) {
  const limit = counts.at(-1) ?? 1;
  const count = Math.min(limit, Math.max(0, c));
  WORKERS_MAX = count;
}

// Limit worker # selection by CPU
const counts = (() => {
  const cpus = navigator.hardwareConcurrency;
  const log2 = Math.floor(Math.log2(cpus));
  const keys = [...Array(log2).keys()];
  const pow2 = keys.map((i) => 2 ** (i + 1));
  return [1, ...pow2];
})();

export { start, reset, setCount, counts };
