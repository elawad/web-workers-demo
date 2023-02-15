import { useState, useRef, useEffect } from 'react';

import resize from '../../resize';
import Image from '../Image';
import './App.css';

const worker = new Worker(new URL('../../worker', import.meta.url), {
  type: 'module',
});

function App() {
  const [fileMap, setFileMap] = useState(new Map());
  const mountRef = useRef();
  const fileRef = useRef();
  const countRef = useRef();

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;

    worker.onmessage = (event) => {
      const { name, image } = event.data;
      setImage(name, image);
    };

    worker.onerror = (event) => {
      console.error('Web Worker Error');
      console.log(event);
    };
  }, []);

  function setImage(name, image) {
    setFileMap((prev) => {
      const copy = new Map(prev);
      copy.set(name, image);
      return copy;
    });
  }

  function handleFileChange(event) {
    const { files } = event.target;

    const newFiles = [...files].filter((file) => !fileMap.get(file.name));
    if (!newFiles.length) return;

    setFileMap((prev) => {
      const copy = new Map(prev);
      newFiles.forEach((file) => copy.set(file.name));
      return copy;
    });

    const count = parseInt(countRef.current.value);

    newFiles.forEach((file) => {
      const { name } = file;
      if (count) worker.postMessage({ name, file });
      else resize(file).then((image) => setImage(name, image));
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
        <select ref={countRef} defaultValue={0}>
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
