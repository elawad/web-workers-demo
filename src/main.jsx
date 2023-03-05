import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
const Slides = lazy(() => import('./Slides'));

const app = window.location.search === '?app';

createRoot(document.getElementById('root')).render(
  <StrictMode>{app ? <App /> : <Slides />}</StrictMode>
);
