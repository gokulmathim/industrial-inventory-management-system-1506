import React, { useState } from "react";
import "./Inventory.css";

// PUBLIC_INTERFACE
/**
 * Inventory table and CRUD logic with search and filters.
 */
function Inventory({ items, onAdd, onEdit, onDelete, onView, searchTerm, setSearchTerm, filter, setFilter }) {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", quantity: 0, critical: 1 });

  function handleEditStart(item) {
    setEditId(item.id);
    setFormData({ name: item.name, quantity: item.quantity, critical: item.critical });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    onEdit(editId, formData);
    setEditId(null);
  }

  function resetForm() {
    setEditId(null);
    setFormData({ name: "", quantity: 0, critical: 1 });
  }

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
    }));
  }

  // PUBLIC_INTERFACE
  function handleAdd(e) {
    e.preventDefault();
    if (!formData.name || formData.quantity < 0 || formData.critical < 0) return;
    onAdd(formData);
    setFormData({ name: "", quantity: 0, critical: 1 });
  }

  return (
    <section className="inventory" data-testid="inventory">
      <div className="inventory-controls">
        <form onSubmit={handleAdd} className="inventory-add-form">
          <input
            type="text"
            placeholder="Item name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            data-testid="inv-add-name"
          />
          <input
            type="number"
            min={0}
            placeholder="Quantity"
            name="quantity"
            required
            value={formData.quantity}
            onChange={handleChange}
            data-testid="inv-add-qty"
          />
          <input
            type="number"
            min={0}
            placeholder="Critical lvl"
            name="critical"
            required
            value={formData.critical}
            onChange={handleChange}
            data-testid="inv-add-crit"
          />
          <button type="submit" className="btn add-btn" data-testid="inv-add-btn">
            Add
          </button>
        </form>
        <div className="inventory-filter-row">
          <input
            type="text"
            placeholder="🔎 Search items"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="inv-search"
            data-testid="inv-search"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="inv-filter"
            data-testid="inv-filter"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Critical Level</th>
            <th>Status</th>
            <th colSpan={3}></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", opacity: 0.7 }}>
                No items found.
              </td>
            </tr>
          ) : (
            items.map(item =>
              editId === item.id ? (
                <tr key={item.id} className="editing-row">
                  <td>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      data-testid="inv-edit-name"
                    />
                  </td>
                  <td>
                    <input
                      name="quantity"
                      type="number"
                      min={0}
                      value={formData.quantity}
                      onChange={handleChange}
                      data-testid="inv-edit-qty"
                    />
                  </td>
                  <td>
                    <input
                      name="critical"
                      type="number"
                      min={0}
                      value={formData.critical}
                      onChange={handleChange}
                      data-testid="inv-edit-crit"
                    />
                  </td>
                  <td>
                    {formData.quantity <= formData.critical ? (
                      <span className="inv-crit">CRITICAL</span>
                    ) : formData.quantity <= formData.critical * 2 ? (
                      <span className="inv-low">LOW</span>
                    ) : (
                      <span className="inv-ok">OK</span>
                    )}
                  </td>
                  <td colSpan={3}>
                    <button type="button" className="btn" onClick={handleEditSubmit} data-testid="inv-edit-save">Save</button>
                    <button type="button" className="btn outline" onClick={resetForm}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.critical}</td>
                  <td>
                    {item.quantity <= item.critical ? (
                      <span className="inv-crit">CRITICAL</span>
                    ) : item.quantity <= item.critical * 2 ? (
                      <span className="inv-low">LOW</span>
                    ) : (
                      <span className="inv-ok">OK</span>
                    )}
                  </td>
                  <td>
                    <button className="btn" onClick={() => onView(item.id)} data-testid="inv-view-btn">
                      View
                    </button>
                  </td>
                  <td>
                    <button className="btn" onClick={() => handleEditStart(item)} data-testid="inv-edit-btn">
                      Edit
                    </button>
                  </td>
                  <td>
                    <button className="btn outline" onClick={() => onDelete(item.id)} data-testid="inv-delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </section>
  );
}

export default Inventory;
