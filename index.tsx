import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Rest Stop: Initializing app...");

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Rest Stop: App mounted successfully.");
  } catch (error) {
    console.error("Rest Stop: Failed to mount app:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: white;">App error: ${error instanceof Error ? error.message : String(error)}</div>`;
  }
} else {
  console.error("Rest Stop: Root element not found.");
}