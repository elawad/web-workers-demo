import { useState, useRef, useEffect } from 'react';

import { callWorker, updateCount, countList } from '../../worker-pool';
import Image from '../Image';
import './App.css';

function App() {
  const [fileMap, setFileMap] = useState(new Map());
  const fileRef = useRef();
  const countRef = useRef();
  const sizeRef = useRef();

  function setImage(id, image) {
    if (!fileRef.current.value) return;

    setFileMap((prev) => {
      const copy = new Map(prev);
      const data = copy.get(id);
      copy.set(id, { ...data, image });
      return copy;
    });
  }

  function handleFileChange(event) {
    const all = event.target.files;
    const files = [...all].filter((file) => !fileMap.get(file.name));

    if (!files.length) return;

    const ids = files.map((file) => file.name);

    const count = parseInt(countRef.current.value);
    const size = parseInt(sizeRef.current.value);

    updateCount(count);

    files.forEach((file) => {
      const id = file.name;
      callWorker(id, file, size, setImage);
    });

    setFileMap((prev) => {
      const copy = new Map(prev);
      ids.forEach((id) => copy.set(id, { size }));
      return copy;
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
          <option disabled>Worker Count</option>
          <option value={0}>Main Thread</option>
          {countList.map((n) => (
            <option key={n} value={n}>
              {n} Worker{n === 1 ? '' : 's'}
            </option>
          ))}
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
        {[...fileMap.entries()].map(([k, v]) => {
          const { image, size } = v;
          return <Image key={k} image={image} size={size} />;
        })}
      </section>
    </main>
  );
}

export default App;
