import React from "react";
import "./Reports.css";

// PUBLIC_INTERFACE
/**
 * Generate and download stock summary report.
 */
function Reports({ onGenerateReport }) {
  return (
    <section className="reports" data-testid="reports">
      <h2>Reports</h2>
      <p>Generate a stock items summary report (CSV):</p>
      <button className="btn" onClick={onGenerateReport} data-testid="report-dl-btn">
        Download CSV
      </button>
    </section>
  );
}

export default Reports;
