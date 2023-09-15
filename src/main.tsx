import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { OptionsProvider } from './useOptions.tsx';

import './index.css';
import 'reactflow/dist/style.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <div className='h-screen w-screen'>
      <OptionsProvider>
        <App />
      </OptionsProvider>
    </div>
  </StrictMode>
);
