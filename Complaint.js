import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function Complaint() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    utility_type: "Electricity",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState({ status: "", q: "" });
  const [statusMsg, setStatusMsg] = useState("");

  const fetchList = async () => {
    try {
      const q = new URLSearchParams(filter).toString();
      const res = await fetch(`${API_BASE}/complaints?${q}`);
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch complaints");
    }
  };

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this complaint?");
    if (!confirmDelete) return;

    const res = await fetch(`${API_BASE}/complaints/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStatusMsg("Complaint deleted successfully!");
      fetchList();
    } else {
      setStatusMsg("Failed to delete complaint.");
    }
  };

  useEffect(() => {
    fetchList();
  }, [filter]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("attachment", file);

      const res = await fetch(`${API_BASE}/complaints`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Submit failed");

      setForm({ name: "", contact: "", address: "", utility_type: "Electricity", description: "" });
      setFile(null);
      fetchList();
      alert("Complaint submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Status change failed");
      fetchList();
    } catch (err) {
      console.error(err);
      alert("Failed to change status");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Utility Complaint Portal</h1>

      {statusMsg && <div style={{ marginBottom: 10, color: "green" }}>{statusMsg}</div>}

      <section style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <h2>Submit a complaint</h2>
        <form onSubmit={submit}>
          <div>
            <label>Name</label><br />
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label>Contact</label><br />
            <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          </div>
          <div>
            <label>Address</label><br />
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label>Utility Type</label><br />
            <select value={form.utility_type} onChange={(e) => setForm({ ...form, utility_type: e.target.value })}>
              <option>Electricity</option>
              <option>Water</option>
              <option>Gas</option>
              <option>Internet</option>
            </select>
          </div>
          <div>
            <label>Description</label><br />
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label>Attachment (optional)</label><br />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Complaints</h2>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="Search" value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} />
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All</option>
            <option>New</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <button onClick={fetchList}>Refresh</button>
        </div>

        <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Utility</th>
              <th>Description</th>
              <th>Status</th>
              <th>Attachment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}<br /><small>{c.contact}</small></td>
                <td>{c.utility_type}</td>
                <td>{c.description}</td>
                <td>{c.status}</td>
                <td>
                  {c.attachment_path ? (
                    <a href={`${API_BASE.replace("/api", "")}/uploads/${c.attachment_path}`} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : "—"}
                </td>
                <td>
                  {c.status !== "In Progress" && <button onClick={() => changeStatus(c.id, "In Progress")}>Mark In Progress</button>}
                  {c.status !== "Resolved" && <button onClick={() => changeStatus(c.id, "Resolved")}>Mark Resolved</button>}
                  <button onClick={() => deleteComplaint(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
