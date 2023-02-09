import { useState, useRef } from 'react';

import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(10);
  const [files, setFiles] = useState([]);
  const fileRef = useRef();

  function handleFileChange(event) {
    const { files } = event.target;
    // for (const f of files) console.log(f.name, f.size);
    setFiles([...files].map((f) => f.name));
  }

  // const files = fileRef.current?.files.map((f) => f.name);

  return (
    <div className="App">
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1> */}

      <div className="card">
        <input
          ref={fileRef}
          onChange={handleFileChange}
          type="file"
          accept="image/jpeg, image/png"
          multiple
          hidden
        />
        <button onClick={() => fileRef.current.click()}>Select Files</button>
      </div>

      <div className="card" style={{ textAlign: 'left' }}>
        {files.map((f) => (
          <h3 key={f}>{f}</h3>
        ))}
      </div>

      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </div>
  );
}

export default App;
