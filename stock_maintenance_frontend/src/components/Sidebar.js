import React from "react";
import "./Sidebar.css";

// PUBLIC_INTERFACE
/**
 * App sidebar navigation for main application routes.
 */
function Sidebar({ routes, activeRoute, onNavigate }) {
  return (
    <aside className="sidebar" data-testid="sidebar">
      <nav>
        <ul>
          {routes.map((route) => (
            <li
              key={route.path}
              className={activeRoute === route.path ? "active" : ""}
              onClick={() => onNavigate(route.path)}
              data-testid={`sidebar-link-${route.path}`}
            >
              <span className="sidebar-icon">{route.icon}</span>
              <span className="sidebar-label">{route.label}</span>
              {route.badge !== undefined && (
                <span className="sidebar-badge">{route.badge}</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
