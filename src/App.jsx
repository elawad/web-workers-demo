import { useState, useRef, useEffect } from 'react';

import './App.css';
import Image from './Image';
import resizeFile from './resize';

const url = new URL('./worker.js', import.meta.url);
let worker;

function App() {
  const [fileMap, setFileMap] = useState(new Map());
  const [workerCount, setWorkerCount] = useState(0);
  const fileRef = useRef();

  useEffect(() => {
    if (!workerCount) {
      worker?.terminate();
      worker = null;
      return;
    }

    worker = new Worker(url, { type: 'module' });
    worker.onmessage = (event) => {
      const { name, image } = event.data;
      setImage(name, image);
    };
  }, [workerCount]);

  function setImage(name, image) {
    setFileMap((prev) => {
      const copy = new Map(prev);
      copy.set(name, image);
      return copy;
    });
  }

  function handleFileChange(event) {
    const { files } = event.target;

    const newFiles = [...files].filter((f) => !fileMap.get(f.name));
    if (!newFiles.length) return;

    setFileMap((prev) => {
      const copy = new Map(prev);
      newFiles.forEach((f) => copy.set(f.name));
      return copy;
    });

    newFiles.forEach((file) => {
      const { name } = file;
      if (worker) worker.postMessage({ name, file });
      else resizeFile(file).then((image) => setImage(name, image));
    });
  }

  function handleReset() {
    fileRef.current.value = null;
    setFileMap(() => new Map());
  }

  return (
    <main className="app">
      <div className="actions">
        <input
          ref={fileRef}
          onChange={handleFileChange}
          type="file"
          accept="image/jpeg, image/png"
          multiple
          hidden
        />
        <button onClick={() => fileRef.current.click()}>Pick Images</button>
        <button onClick={handleReset}>×</button>
        <select
          value={workerCount}
          onChange={(e) => setWorkerCount(parseInt(e.target.value))}
        >
          <option value={0}>Worker Off</option>
          <option value={1}>Worker On</option>
        </select>
      </div>

      <section className="images">
        {[...fileMap.entries()].map(([name, image]) => (
          <Image key={name} image={image} />
        ))}
      </section>
    </main>
  );
}

export default App;
