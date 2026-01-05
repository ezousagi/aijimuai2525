import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Rest Stop: Starting initialization...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Rest Stop: Critical Error - Root element not found in DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Rest Stop: React application mounted.");
  } catch (err) {
    console.error("Rest Stop: React mounting failed:", err);
    const overlay = document.getElementById('debug-overlay');
    if (overlay) {
      const div = document.createElement('div');
      div.className = 'error-msg';
      div.innerText = 'Mount Error: ' + (err instanceof Error ? err.message : String(err));
      overlay.appendChild(div);
    }
  }
}