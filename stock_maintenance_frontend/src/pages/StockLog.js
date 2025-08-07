import React from "react";
import "./StockLog.css";

// PUBLIC_INTERFACE
/**
 * Stock movement logs table and filtering.
 */
function StockLog({ logs, items, filterByItem, setFilterByItem }) {
  return (
    <section className="stocklog" data-testid="stocklog">
      <div className="stocklog-controls">
        <select
          value={filterByItem}
          onChange={e => setFilterByItem(e.target.value)}
          className="stocklog-filter"
        >
          <option value="">All Items</option>
          {items.map(item => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <table className="stocklog-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Change</th>
            <th>Qty After</th>
            <th>User</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", opacity: 0.6 }}>No logs found.</td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.date).toLocaleString()}</td>
                <td>{log.itemName}</td>
                <td>
                  {log.delta > 0 ? (
                    <span className="stocklog-in">+{log.delta}</span>
                  ) : (
                    <span className="stocklog-out">{log.delta}</span>
                  )}
                </td>
                <td>{log.newQuantity}</td>
                <td>{log.user || "-"}</td>
                <td>{log.note || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default StockLog;
