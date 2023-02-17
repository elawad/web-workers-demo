import { useState, useRef, useEffect } from 'react';

import resize from './resize';

const maxCount = navigator.hardwareConcurrency;
const workers = [];
const callbacks = new Map();
let index = -1;

async function callWorker(id, file, size, cb) {
  const total = workers.length;

  if (!total) {
    const image = await resize(file, size);
    cb(id, image);
    return;
  }

  index++;
  if (index >= total) index = 0;

  callbacks.set(id, cb);
  workers[index].postMessage({ id, file, size });
}

function updateCount(n) {
  const count = n > maxCount ? maxCount : n;
  const total = workers.length;

  // Remove Workers
  if (count < total) {
    while (count < workers.length) {
      const worker = workers.pop();
      worker.terminate();
    }
    return;
  }

  // No support in FF.
  if (!canUseModule) {
    console.error('Web Worke module not supported. Use Chrome/Safari');
    return;
  }

  // Add Workers
  if (count > total) {
    while (count > workers.length) {
      const worker = new Worker(new URL('./worker', import.meta.url), {
        type: 'module',
      });

      worker.onerror = console.error;
      worker.onmessage = (event) => {
        const { id, image } = event.data;
        const cb = callbacks.get(id);
        cb(id, image);
        callbacks.delete(id);
      };
      workers.push(worker);
    }
  }
}

const countList = [...Array(maxCount).keys()]
  .map((n) => n + 1)
  .filter((n) => n === 1 || !(n % 2) || n === maxCount);

const canUseModule = (function () {
  let supports = false;
  const tester = {
    get type() {
      supports = true;
    },
  };
  try {
    const worker = new Worker('data:,', tester).terminate();
  } finally {
    return supports;
  }
})();

export { callWorker, updateCount, countList };
