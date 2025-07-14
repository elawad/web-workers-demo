import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App';
import Slides from './Slides';

const Comp = window.location.search === '?1' ? App : Slides;
const root = document.getElementById('root') as HTMLDivElement;

createRoot(root).render(
  <StrictMode>
    <Comp />
  </StrictMode>
);
