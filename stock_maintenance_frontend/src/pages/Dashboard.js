import React from "react";
import "./Dashboard.css";

// PUBLIC_INTERFACE
/**
 * Dashboard for stock overview (statistics, critical items).
 */
function Dashboard({ stats, lowStockItems, onItemView }) {
  return (
    <div className="dashboard" data-testid="dashboard">
      <div className="dashboard-row">
        <div className="dashboard-card">
          <h3>Total Stock Items</h3>
          <div className="db-main">{stats.totalItems}</div>
        </div>
        <div className="dashboard-card">
          <h3>Total Quantity</h3>
          <div className="db-main">{stats.totalQuantity}</div>
        </div>
        <div className="dashboard-card">
          <h3>Critical Stock</h3>
          <div className="db-main accent">{stats.criticalCount}</div>
        </div>
        <div className="dashboard-card">
          <h3>Movements (24h)</h3>
          <div className="db-main">{stats.movements}</div>
        </div>
      </div>
      <div className="dashboard-alerts">
        <h4>Low/Critical Stock Alerts</h4>
        {lowStockItems.length === 0 ? (
          <div className="empty-alert">No low-stock items 🎉</div>
        ) : (
          <ul>
            {lowStockItems.map(item => (
              <li key={item.id} onClick={() => onItemView(item.id)}>
                <span className="alert-item-name">{item.name}</span>
                <span className="alert-item-qty">
                  Qty: <strong>{item.quantity}</strong>
                  {item.quantity <= item.critical ? (
                    <span className="critical"> CRITICAL</span>
                  ) : (
                    <span className="low"> LOW</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
