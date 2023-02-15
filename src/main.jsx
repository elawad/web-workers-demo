import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './components/App';
import Slides from './components/Slides';

const app = window.location.search === '?app';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {app ? <App /> : <Slides />}
  </React.StrictMode>
);
