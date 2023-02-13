import { useState, useRef, useEffect } from 'react';

import './App.css';
import Image from './Image';

const worker = new Worker(new URL('./worker.js', import.meta.url));
// const url = new URL('./worker.js', import.meta.url);
// const worker = new Worker(url, { type: 'module' });

function App() {
  const [fileMap, setFileMap] = useState(new Map());
  const fileRef = useRef();
  const mountRef = useRef();

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;

    worker.onmessage = (event) => {
      const { id, image } = event.data;

      setFileMap((prev) => {
        const copy = new Map(prev);
        copy.set(id, { image, isDone: true });
        return copy;
      });
    };
  }, []);

  function handleFileChange(event) {
    const { files } = event.target;

    const newFiles = [...files].filter((f) => !fileMap.get(f.name));
    if (!newFiles.length) return;

    setFileMap((prev) => {
      const copy = new Map(prev);
      newFiles.forEach((f) => copy.set(f.name));
      return copy;
    });

    newFiles.forEach((f) => worker.postMessage({ id: f.name, file: f }));
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
        <button onClick={() => fileRef.current.click()}>Select Images</button>
        <button onClick={handleReset}>×</button>
      </div>

      <section className="images">
        {[...fileMap.entries()].map(([k, v]) => (
          <Image key={k} image={v?.image} isDone={v?.isDone} />
        ))}
      </section>
    </main>
  );
}

export default App;
