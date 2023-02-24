import { useState, useRef } from 'react';

import Image from '../Image';
import * as Workers from '../workers';
import './index.css';

function App() {
  const [imageMap, setImageMap] = useState(new Map());
  const fileRef = useRef();
  const countRef = useRef();
  const sizeRef = useRef();

  function setImage(id, image) {
    if (!fileRef.current.value) return;

    setImageMap((prev) => {
      const copy = new Map(prev);
      const data = copy.get(id);
      copy.set(id, { ...data, image });
      return copy;
    });
  }

  function handleFileChange() {
    // const all = [...event.target.files];
    const all = [...fileRef.current.files];
    const count = parseInt(countRef.current.value);
    const size = parseInt(sizeRef.current.value);
    const dpr = window.devicePixelRatio;
    const sizeX = size * dpr;

    Workers.setCount(count);

    const files = all.slice(0, 20).filter((file) => !imageMap.get(file.name));

    if (!files.length) return;

    setImageMap((prev) => {
      const copy = new Map(prev);
      files.forEach((file) => copy.set(file.name, { size, dpr }));
      return copy;
    });

    files.forEach((file) => {
      Workers.start({ id: file.name, file, size: sizeX, cb: setImage });
    });
  }

  function handleReset() {
    Workers.reset();

    fileRef.current.value = null;
    setImageMap(() => new Map());
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
          <option disabled>Threads</option>
          <option value={0}>Main Thread</option>
          {Workers.counts.map((n) => (
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
          <option value={400}>400</option>
        </select>
      </div>

      <section className="images">
        {[...imageMap.entries()].map(([id, data]) => (
          <Image key={id} {...data} />
        ))}
      </section>
    </main>
  );
}

export default App;
