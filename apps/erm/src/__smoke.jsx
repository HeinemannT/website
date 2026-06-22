import React from 'react';
import { renderToString } from 'react-dom/server.browser';
import { StoreProvider } from './store.jsx';
import App from './App.jsx';
export function render() { return renderToString(React.createElement(StoreProvider, null, React.createElement(App))); }
