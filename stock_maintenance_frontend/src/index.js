import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Additional page and component CSS imports for global build
import "./components/Sidebar.css";
import "./components/Header.css";
import "./components/Notifications.css";
import "./pages/Dashboard.css";
import "./pages/Inventory.css";
import "./pages/StockLog.css";
import "./pages/Reports.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
