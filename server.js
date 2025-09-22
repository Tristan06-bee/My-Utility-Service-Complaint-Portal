import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ------------------ Complaints ------------------ //
let complaints = [];
let complaintId = 1;

// GET complaints
app.get("/api/complaints", (req, res) => {
  const { q = "", status = "" } = req.query;
  let result = complaints;

  if (q) {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.description.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (status) {
    result = result.filter(
      (c) => c.status.toLowerCase() === status.toLowerCase()
    );
  }

  res.json(result);
});

// POST complaint
app.post("/api/complaints", upload.single("attachment"), (req, res) => {
  const { name, contact, address, utility_type, description } = req.body;
  const attachment_path = req.file ? req.file.filename : null;

  const complaint = {
    id: complaintId++,
    name,
    contact,
    address,
    utility_type,
    description,
    status: "New",
    attachment_path,
  };

  complaints.push(complaint);
  res.json(complaint);
});

// PATCH complaint status
app.patch("/api/complaints/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const complaint = complaints.find((c) => c.id === parseInt(id));
  if (!complaint) return res.status(404).json({ error: "Not found" });

  complaint.status = status;
  res.json(complaint);
});

// DELETE complaint
app.delete("/api/complaints/:id", (req, res) => {
  const { id } = req.params;
  const index = complaints.findIndex((c) => c.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: "Not found" });

  complaints.splice(index, 1);
  res.json({ message: "Complaint deleted successfully" });
});

// ------------------ Contact Messages ------------------ //
let contacts = [];
let contactId = 1;

// POST contact message
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const contact = {
    id: contactId++,
    name,
    email,
    message,
    created_at: new Date(),
  };

  contacts.push(contact);
  res.json({ message: "Message submitted successfully!", contact });
});

// GET contact messages
app.get("/api/contact", (req, res) => {
  res.json(contacts);
});

// ------------------ Serve Uploads ------------------ //
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ------------------ Start Server ------------------ //
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
