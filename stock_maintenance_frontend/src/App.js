import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Notifications from "./components/Notifications";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import StockLog from "./pages/StockLog";
import Reports from "./pages/Reports";
import { apiRequest } from "./api";

// Route definitions and icons
const routes = [
  { path: "dashboard", label: "Dashboard", icon: "📊" },
  { path: "inventory", label: "Inventory", icon: "📦" },
  { path: "stocklog", label: "Stock Log", icon: "📜" },
  { path: "reports", label: "Reports", icon: "📝" },
];

function randomId() {
  return (
    "_" +
    Math.random().toString(36).substring(2, 9) +
    Date.now().toString(36).substring(2)
  );
}

// PUBLIC_INTERFACE
/**
 * Main application component for Industrial Inventory Management.
 * Contains light/minimal UI, stock dashboard, inventory CRUD, logs, notifications.
 */
function App() {
  const [theme, setTheme] = useState("light");
  const [route, setRoute] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Application state
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [reportData, setReportData] = useState(null);

  // For stock log filtering
  const [logFilterItem, setLogFilterItem] = useState("");

  // For dashboard
  const [dashboardStats, setDashboardStats] = useState({
    totalItems: 0,
    totalQuantity: 0,
    criticalCount: 0,
    movements: 0,
  });

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch inventory, logs, notifications from backend
  useEffect(() => {
    // Simulated async load; replace with backend apiRequest endpoints as needed.
    async function loadData() {
      try {
        const items = await apiRequest("/items");
        setInventory(items);

        const logs_ = await apiRequest("/logs");
        setLogs(logs_);

        let notifications_ = [];
        items.forEach((item) => {
          if (item.quantity <= item.critical) {
            notifications_.push({
              id: randomId(),
              type: "critical",
              itemName: item.name,
              quantity: item.quantity,
              date: new Date().toISOString(),
              unread: true,
            });
          } else if (item.quantity <= item.critical * 2) {
            notifications_.push({
              id: randomId(),
              type: "low",
              itemName: item.name,
              quantity: item.quantity,
              date: new Date().toISOString(),
              unread: true,
            });
          }
        });
        setNotifications(notifications_);
        // Dashboard stats
        setDashboardStats({
          totalItems: items.length,
          totalQuantity: items.reduce((acc, curr) => acc + curr.quantity, 0),
          criticalCount: items.filter((i) => i.quantity <= i.critical).length,
          movements: logs_.filter(
            (log) =>
              (Date.now() - new Date(log.date).getTime()) / 1000 / 60 / 60 <= 24
          ).length,
        });
      } catch (e) {
        // fallback to sample data if backend unavailable
        const sampleInv = [
          { id: "item1", name: "Steel Bolts", quantity: 30, critical: 10 },
          { id: "item2", name: "Bearings", quantity: 7, critical: 12 },
          { id: "item3", name: "Hydraulic Oil", quantity: 2, critical: 2 },
        ];
        const sampleLogs = [
          { id: "log1", itemName: "Steel Bolts", delta: +10, newQuantity: 30, date: new Date(Date.now()-50000000).toISOString(), user: "Alice", note: "Restocked" },
          { id: "log2", itemName: "Hydraulic Oil", delta: -1, newQuantity: 2, date: new Date().toISOString(), user: "Bob", note: "Used for maintenance" }
        ];
        setInventory(sampleInv);
        setLogs(sampleLogs);
        setNotifications([
          {
            id: randomId(),
            type: "critical",
            itemName: "Hydraulic Oil",
            quantity: 2,
            date: new Date().toISOString(),
            unread: true,
          },
          {
            id: randomId(),
            type: "low",
            itemName: "Bearings",
            quantity: 7,
            date: new Date().toISOString(),
            unread: true,
          },
        ]);
        setDashboardStats({
          totalItems: 3,
          totalQuantity: 39,
          criticalCount: 1,
          movements: 1,
        });
      }
    }
    loadData();
  }, []);

  // Sidebar route nav
  function handleNav(path) {
    setRoute(path);
    setSidebarOpen(false);
    setNotifOpen(false);
  }

  // CRUD: Inventory
  async function handleAddItem(data) {
    const newItem = { ...data, id: randomId() };
    setInventory((inv) => [...inv, newItem]);
    setDashboardStats((stats) => ({
      ...stats,
      totalItems: stats.totalItems + 1,
      totalQuantity: stats.totalQuantity + data.quantity,
    }));
    // Optionally call apiRequest("/items", { method: 'POST', body: newItem });
  }
  async function handleEditItem(id, data) {
    setInventory((inv) =>
      inv.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
    // Optionally call apiRequest(`/items/${id}`, { method: 'PUT', body: data });
  }
  async function handleDeleteItem(id) {
    setInventory((inv) => inv.filter((item) => item.id !== id));
    // Optionally call apiRequest(`/items/${id}`, { method: 'DELETE' });
  }
  function handleViewItem(itemId) {
    setRoute("inventory");
    // Could open a modal for details, or highlight the item
  }

  // Inventory filter logic
  const filteredInventory = inventory.filter((item) => {
    let matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchStatus = true;
    if (filterStatus === "low") {
      matchStatus = item.quantity <= item.critical * 2 && item.quantity > item.critical;
    } else if (filterStatus === "critical") {
      matchStatus = item.quantity <= item.critical;
    }
    return matchSearch && matchStatus;
  });

  // Stock log filter
  const filteredLogs = logs.filter((log) =>
    !logFilterItem ||
      (inventory.find((itm) => itm.id === logFilterItem)?.name === log.itemName)
  );

  // Notifications
  function handleShowNotifications() {
    setNotifOpen((open) => !open);
  }
  function handleMarkAllRead() {
    setNotifications((n) => n.map((notf) => ({ ...notf, unread: false })));
    setNotifOpen(false);
  }
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Reports
  function handleGenerateReport() {
    // Downloads a CSV of items (demo only)
    const csvRows = [
      "ID,Name,Quantity,Critical Level",
      ...inventory.map(
        (i) => `${i.id},${i.name},${i.quantity},${i.critical}`
      ),
    ].join("\n");
    const blob = new Blob([csvRows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "stock_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Determine which content to show
  let content = null;
  if (route === "dashboard") {
    content = (
      <Dashboard
        stats={dashboardStats}
        lowStockItems={inventory.filter((i) => i.quantity <= i.critical * 2)}
        onItemView={handleViewItem}
      />
    );
  } else if (route === "inventory") {
    content = (
      <Inventory
        items={filteredInventory}
        onAdd={handleAddItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onView={handleViewItem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filterStatus}
        setFilter={setFilterStatus}
      />
    );
  } else if (route === "stocklog") {
    content = (
      <StockLog
        logs={filteredLogs}
        items={inventory}
        filterByItem={logFilterItem}
        setFilterByItem={setLogFilterItem}
      />
    );
  } else if (route === "reports") {
    content = <Reports onGenerateReport={handleGenerateReport} />;
  }

  // Layout
  return (
    <div className="App" style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar
        routes={routes.map((r) =>
          r.path === "inventory"
            ? { ...r, badge: inventory.filter((i) => i.quantity <= i.critical * 2).length }
            : r
        )}
        activeRoute={route}
        onNavigate={handleNav}
      />
      <div className="main-content">
        <Header onShowNotifications={handleShowNotifications} unreadCount={unreadCount} />
        <button 
          className="theme-toggle" 
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{ position: "absolute", top: 20, right: 28, zIndex: 101 }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <Notifications
          notifications={notifications.filter((n) => n.unread)}
          onMarkRead={handleMarkAllRead}
          open={notifOpen}
        />
        <div style={{ marginLeft: 216, paddingTop: 25 }}>
          {content}
        </div>
      </div>
    </div>
  );
}

export default App;
