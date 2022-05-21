import ReactDOM from 'react-dom';
import React from 'react';
import { RecoilRoot } from 'recoil';

import App from './App.jsx';
import './index.scss';

// render
ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('root'),
);

// dev tool supports
if (window.electronAPI.isDev()) {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'F12') {
      window.electronAPI.toggleDebug();
    } else if (e.code === 'F5') {
      window.electronAPI.refresh();
    }
  });
}
