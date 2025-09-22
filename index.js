import React from 'react';
import ReactDOM from 'react-dom/frontend';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'; // Only import once

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Call reportWebVitals once
reportWebVitals();
