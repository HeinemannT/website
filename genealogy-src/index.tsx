import React from 'react';
import ReactDOM from 'react-dom/client';
import GenealogyApp from './GenealogyApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GenealogyApp />
  </React.StrictMode>
);