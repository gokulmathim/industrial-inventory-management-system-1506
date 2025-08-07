import React from "react";
import "./Header.css";

// PUBLIC_INTERFACE
/**
 * Application header with title, notifications, and quick actions.
 */
function Header({ onShowNotifications, unreadCount }) {
  return (
    <header className="app-header" data-testid="header">
      <span className="header-logo">
        {/* Logo or brand */}
        <span style={{ color: "var(--primary, #1976d2)", fontWeight: 700, fontSize: "1.2em" }}>
          StockMaster
        </span>
      </span>
      <div className="header-actions">
        <button
          className="notification-btn"
          aria-label="Show notifications"
          data-testid="notif-btn"
          onClick={onShowNotifications}
        >
          <span role="img" aria-label="bell">🔔</span>
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </button>
        {/* Add more quick actions or links here */}
      </div>
    </header>
  );
}

export default Header;
