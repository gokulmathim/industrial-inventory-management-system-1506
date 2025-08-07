import React from "react";
import "./Notifications.css";

// PUBLIC_INTERFACE
/**
 * List of low stock notifications with mark as read.
 */
function Notifications({ notifications, onMarkRead, open }) {
  if (!open) return null;
  return (
    <div className="notif-popup" data-testid="notifications">
      <div className="notif-header">
        Notifications
        <button className="notif-close" onClick={onMarkRead}>Mark all read</button>
      </div>
      {notifications.length === 0 ? (
        <div className="notif-empty">No notifications.</div>
      ) : (
        <ul>
          {notifications.map(n => (
            <li key={n.id} className={n.unread ? "unread" : ""}>
              <div className="notif-title">
                {n.type === "critical"
                  ? <span style={{ color: "#e53935" }}>Critical</span>
                  : <span style={{ color: "#ffb300" }}>Low</span>} Stock: <b>{n.itemName}</b>
              </div>
              <div className="notif-msg">Current: {n.quantity}</div>
              <div className="notif-time">{new Date(n.date).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
