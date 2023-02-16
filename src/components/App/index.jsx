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
  const sizeRef = useRef();

  useEffect(() => {
    if (mountRef.current) return;
    mountRef.current = true;

    worker.onmessage = (event) => {
      const { name, image } = event.data;
      setImage({ name, image });
    };
    worker.onerror = console.error;
  }, []);

  function setImage({ name, image }) {
    if (!fileRef.current.value) return;

    setFileMap((prev) => {
      const copy = new Map(prev);
      const data = copy.get(name);
      copy.set(name, { ...data, image });
      return copy;
    });
  }

  function handleFileChange(event) {
    const { files } = event.target;

    const newFiles = [...files].filter((file) => !fileMap.get(file.name));
    if (!newFiles.length) return;

    const count = parseInt(countRef.current.value);
    const size = parseInt(sizeRef.current.value);

    setFileMap((prev) => {
      const copy = new Map(prev);
      newFiles.forEach((file) => copy.set(file.name, { size }));
      return copy;
    });

    newFiles.forEach((file) => {
      const { name } = file;
      if (count) worker.postMessage({ name, file, size });
      else resize({ file, size }).then((image) => setImage({ name, image }));
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

        <select ref={countRef} defaultValue={1}>
          <option disabled>Thread</option>
          <option value={1}>Worker</option>
          <option value={0}>Main Thread</option>
        </select>

        <select ref={sizeRef} defaultValue={240}>
          <option disabled>Image Size</option>
          <option value={160}>160</option>
          <option value={240}>240</option>
          <option value={320}>320</option>
          <option value={480}>480</option>
        </select>
      </div>

      <section className="images">
        {[...fileMap.entries()].map((entry) => {
          const [name, { image, size }] = entry;
          return <Image key={name} image={image} size={size} />;
        })}
      </section>
    </main>
  );
}

export default App;
