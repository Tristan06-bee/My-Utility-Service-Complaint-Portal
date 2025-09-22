import React, { useState } from 'react';

export default function ComplaintForm() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    address: '',
    utility_type: '',
    description: '',
    date: ''
  });
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed to submit complaint");

      const data = await res.json();

      setStatus({
        type: "success",
        message: "Complaint submitted (ID " + data.id + ")"
      });

      // clear form
      setForm({
        name: '',
        contact: '',
        address: '',
        utility_type: '',
        description: '',
        date: ''
      });

      // Dispatch event so list can refresh
      window.dispatchEvent(new Event("complaintCreated"));
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Failed to submit complaint" });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h2>Submit a complaint</h2>

      <div style={{ marginBottom: 8 }}>
        <label>Name</label><br />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Contact</label><br />
        <input
          name="contact"
          type="text"
          value={form.contact}
          onChange={handleChange}
          style={{ width: '100%' }}
          required
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Address</label><br />
        <input
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Service Type</label><br />
        <select
          name="utility_type"
          value={form.utility_type}
          onChange={handleChange}
          style={{ width: '100%' }}
          required
        >
          <option value="">-- choose --</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Internet">Internet</option>
          <option value="Gas">Gas</option>
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Complaint Description</label><br />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Date (service date)</label><br />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>

      <button type="submit">Submit Complaint</button>

      {status && (
        <p style={{ color: status.type === 'error' ? 'red' : 'green' }}>
          {status.message}
        </p>
      )}
    </form>
  );
}