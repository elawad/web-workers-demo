import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import Slides from './Slides';
import './index.css';

const Comp = window.location.search === '?1' ? App : Slides;
const root = document.getElementById('root') as HTMLDivElement;

createRoot(root).render(
  <StrictMode>
    <Comp />
  </StrictMode>
);
