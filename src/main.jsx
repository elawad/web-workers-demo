import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './components/App';
import Slides from './components/Slides';

const app = window.location.search === '?app';

createRoot(document.getElementById('root')).render(
  <StrictMode>{app ? <App /> : <Slides />}</StrictMode>
);
