import { useState, useEffect, useMemo } from "react";
import "./App.css";

const API = "http://localhost:5001/api";

const STATUS_ORDER = ["Pending", "Picked Up", "In Transit", "Delivered", "Cancelled"];

const STATUS_COLORS = {
  Pending:     { bg: "#FFF3CD", text: "#856404", border: "#FFEAA0" },
  "Picked Up": { bg: "#CCE5FF", text: "#004085", border: "#B8D4F0" },
  "In Transit":{ bg: "#D4EDDA", text: "#155724", border: "#B8DFC1" },
  Delivered:   { bg: "#D1ECF1", text: "#0C5460", border: "#A8D8E0" },
  Cancelled:   { bg: "#F8D7DA", text: "#721C24", border: "#F0B8BD" },
};

const EMPTY_FORM = { sender: "", receiver: "", origin: "", destination: "" };

export default function App() {
  const [shipments, setShipments]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch]         = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [toast, setToast]           = useState(null);

  // ── Fetch shipments ───────────────────────────────────────────────────────

  const fetchShipments = async () => {
    try {
      const res = await fetch(`${API}/shipments`);
      if (!res.ok) throw new Error("Failed to fetch");
      setShipments(await res.json());
    } catch (e) {
      setError("Could not load shipments. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShipments(); }, []);

  // ── Toast notification ────────────────────────────────────────────────────

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Stats calculation ─────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const counts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]));
    shipments.forEach((s) => { if (counts[s.status] !== undefined) counts[s.status]++; });
    return counts;
  }, [shipments]);

  // ── Filter and search ─────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const matchStatus = filterStatus === "All" || s.status === filterStatus;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        s.destination.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.sender.toLowerCase().includes(q) ||
        s.receiver.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [shipments, filterStatus, search]);

  // ── Create new shipment ───────────────────────────────────────────────────

  const validate = () => {
    const errs = {};
    ["sender", "receiver", "origin", "destination"].forEach((f) => {
      if (!form[f].trim()) errs[f] = "Required";
    });
    return errs;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { 
        const d = await res.json(); 
        throw new Error(d.error); 
      }
      const created = await res.json();
      setShipments((prev) => [created, ...prev]);
      setForm(EMPTY_FORM);
      setFormErrors({});
      setShowForm(false);
      showToast("Shipment created successfully!");
    } catch (e) {
      showToast(e.message || "Failed to create shipment", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Update shipment status ────────────────────────────────────────────────

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API}/shipments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setShipments((prev) => prev.map((s) => s.id === id ? updated : s));
      showToast(`Status updated to "${newStatus}"`);
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      {/* Toast notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div>
            <div className="logo">SAMEX<span className="logo-dot">.</span>DELIVERY</div>
            <div className="logo-sub">Shipment Tracker</div>
          </div>
          <button className="add-btn" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "✕ Cancel" : "+ New Shipment"}
          </button>
        </div>
      </header>

      <main className="main">
        {/* Stats strip */}
        <div className="stats-row">
          {STATUS_ORDER.map((s) => (
            <div 
              key={s} 
              className="stat-card"
              style={{ borderTop: `3px solid ${STATUS_COLORS[s].border}` }}
            >
              <div className="stat-count" style={{ color: STATUS_COLORS[s].text }}>
                {stats[s]}
              </div>
              <div className="stat-label">{s}</div>
            </div>
          ))}
        </div>

        {/* New Shipment Form */}
        {showForm && (
          <div className="form-card">
            <h2 className="form-title">New Shipment</h2>
            <form onSubmit={handleCreate} className="form" noValidate>
              {[
                ["sender", "Sender Name"],
                ["receiver", "Receiver Name"],
                ["origin", "Origin City"],
                ["destination", "Destination City"],
              ].map(([field, label]) => (
                <div key={field} className="field-group">
                  <label className="label">{label}</label>
                  <input
                    className={`input ${formErrors[field] ? "input-error" : ""}`}
                    value={form[field]}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, [field]: e.target.value }));
                      if (formErrors[field]) setFormErrors((p) => ({ ...p, [field]: "" }));
                    }}
                    placeholder={label}
                  />
                  {formErrors[field] && (
                    <span className="err-text">{formErrors[field]}</span>
                  )}
                </div>
              ))}
              <button className="submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Shipment"}
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="filter-row">
          <input
            className="search-input"
            placeholder="Search by sender, destination, city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="status-filters">
            {["All", ...STATUS_ORDER].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`filter-btn ${filterStatus === s ? "filter-btn-active" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Shipments Table */}
        {loading ? (
          <div className="center">Loading shipments…</div>
        ) : error ? (
          <div className="center error-text">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="center">No shipments match your filter.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {["Sender", "Receiver", "Origin", "Destination", "Status", "Update Status", "Date"].map((h) => (
                    <th key={h} className="th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="tr">
                    <td className="td">{s.sender}</td>
                    <td className="td">{s.receiver}</td>
                    <td className="td">{s.origin}</td>
                    <td className="td">{s.destination}</td>
                    <td className="td">
                      <span 
                        className="badge"
                        style={{
                          background: STATUS_COLORS[s.status].bg,
                          color: STATUS_COLORS[s.status].text,
                          border: `1px solid ${STATUS_COLORS[s.status].border}`,
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="td">
                      <select
                        className="select"
                        value={s.status}
                        onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      >
                        {STATUS_ORDER.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="td">
                      {new Date(s.createdAt).toLocaleDateString("en-IN", { 
                        day: "2-digit", 
                        month: "short", 
                        year: "numeric" 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
