import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
const Slides = lazy(() => import('./Slides'));

const Comp = window.location.search === '?1' ? App : Slides;
const root = document.getElementById('root');

createRoot(root).render(
  <StrictMode>
    <Comp />
  </StrictMode>
);
