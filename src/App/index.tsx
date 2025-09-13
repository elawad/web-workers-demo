import { useRef, useState } from 'react';

import './index.css';

import Image, { type ImageProps } from '../Image';
import type { MsgDone } from '../types';
import * as Workers from '../workers';

type AppProps = { inSlide?: boolean };
type ImgMap = Map<MsgDone['id'], ImageProps>;

function App({ inSlide }: AppProps) {
  const [imageMap, setImageMap] = useState<ImgMap>(new Map());
  const fileRef = useRef<HTMLInputElement>(null);
  const countRef = useRef<HTMLSelectElement>(null);
  const sizeRef = useRef<HTMLSelectElement>(null);

  function onDone({ id, image }: MsgDone) {
    if (!fileRef.current?.value) return;

    setImageMap((prev) => {
      const copy = new Map(prev);
      const props = copy.get(id);
      if (props) {
        copy.set(id, { ...props, image, isDone: true });
      }
      return copy;
    });
  }

  function onFiles() {
    const all = Array.from(fileRef.current?.files ?? []);
    const count = Number.parseInt(countRef.current?.value ?? '0', 10);
    const size = Number.parseInt(sizeRef.current?.value ?? '0', 10);
    const dpr = window.devicePixelRatio;
    const sizeDpr = size * dpr;
    const files = all.filter((file) => !imageMap.has(file.name)).slice(0, 16);
    if (!files.length) return;

    setImageMap((prev) => {
      const copy = new Map(prev);
      for (const file of files) {
        copy.set(file.name, { size, dpr });
      }
      return copy;
    });

    Workers.setCount(count);
    for (const file of files) {
      Workers.start({ id: file.name, file, size: sizeDpr, onDone });
    }
  }

  function onReset() {
    Workers.reset();

    if (fileRef.current) {
      fileRef.current.files = null;
      fileRef.current.value = '';
    }
    setImageMap(new Map());
  }

  return (
    <main className={`app${inSlide ? '' : ' space'}`}>
      {!inSlide && <h1>Demo</h1>}

      <div className="actions">
        <input
          ref={fileRef}
          onChange={onFiles}
          type="file"
          accept="image/jpeg, image/png"
          multiple
          hidden
        />
        <button type="button" onClick={() => fileRef.current?.click()}>
          Pick Images
        </button>

        <button type="button" onClick={onReset}>
          ×
        </button>

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
        {[...imageMap.entries()].map(([id, props]) => (
          <Image key={id} {...props} />
        ))}
      </section>
    </main>
  );
}

export default App;
