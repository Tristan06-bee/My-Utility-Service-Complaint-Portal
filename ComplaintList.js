import React, { useEffect, useState } from "react";

export default function ComplaintList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/complaints");
      const data = await res.json();
      setList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();

    const handler = () => fetchList();
    window.addEventListener("complaintCreated", handler);

    return () => window.removeEventListener("complaintCreated", handler);
  }, []);


  if (loading) return <p>Loading complaints...</p>;

  return (
    <div>
      <h2>Recent Complaints</h2>
      {list.length === 0 && <p>No complaints yet.</p>}
      <ul>
        {list.map((c) => (
          <li key={c.id} style={{ marginBottom: 12 }}>
            <strong>
              #{c.id} {c.name}
            </strong>{" "}
            — {c.utility_type} ({c.date || "no date"})
            <div>{c.description}</div>
            <small>
              {c.contact} •{" "}
              {c.created_at
                ? new Date(c.created_at).toLocaleString()
                : "just now"}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
