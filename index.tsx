import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Rest Stop: Initializing app modules...");

const init = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error("Rest Stop: Critical Error - Root element not found.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Rest Stop: React application mounted successfully.");
  } catch (err) {
    console.error("Rest Stop: React mounting failed:", err);
    const overlay = document.getElementById('debug-overlay');
    if (overlay) {
      const div = document.createElement('div');
      div.className = 'error-msg';
      div.innerText = 'Runtime Error during Mount: ' + (err instanceof Error ? err.message : String(err));
      overlay.appendChild(div);
    }
  }
};

// DOMが準備できていない可能性を考慮してDOMContentLoadedを待つ
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}