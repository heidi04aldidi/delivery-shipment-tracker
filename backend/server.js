const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// ─── In-memory store ─────────────────────────────────────────────────────────

const VALID_STATUSES = ["Pending", "Picked Up", "In Transit", "Delivered", "Cancelled"];

let shipments = [
  { id: uuidv4(), sender: "Raj Mehta",      receiver: "Anita Sharma",   origin: "Mumbai",    destination: "Delhi",     status: "Delivered",  createdAt: new Date("2025-05-10") },
  { id: uuidv4(), sender: "Priya Nair",     receiver: "Suresh Pillai",  origin: "Pune",      destination: "Bangalore", status: "In Transit", createdAt: new Date("2025-05-12") },
  { id: uuidv4(), sender: "Vikram Singh",   receiver: "Meena Joshi",    origin: "Delhi",     destination: "Chennai",   status: "Picked Up",  createdAt: new Date("2025-05-13") },
  { id: uuidv4(), sender: "Aisha Khan",     receiver: "Rahul Verma",    origin: "Hyderabad", destination: "Kolkata",   status: "Pending",    createdAt: new Date("2025-05-14") },
  { id: uuidv4(), sender: "Nikhil Gupta",   receiver: "Sona Thomas",    origin: "Ahmedabad", destination: "Mumbai",    status: "Cancelled",  createdAt: new Date("2025-05-11") },
  { id: uuidv4(), sender: "Deepa Reddy",    receiver: "Arjun Malhotra", origin: "Chennai",   destination: "Pune",      status: "In Transit", createdAt: new Date("2025-05-15") },
  { id: uuidv4(), sender: "Kiran Bose",     receiver: "Fatima Sheikh",  origin: "Kolkata",   destination: "Jaipur",    status: "Pending",    createdAt: new Date("2025-05-16") },
  { id: uuidv4(), sender: "Manish Tiwari",  receiver: "Latha Iyer",     origin: "Bangalore", destination: "Hyderabad", status: "Delivered",  createdAt: new Date("2025-05-09") },
];

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/shipments - Return all shipments
app.get("/api/shipments", (req, res) => {
  res.json(shipments);
});

// POST /api/shipments - Create new shipment
app.post("/api/shipments", (req, res) => {
  const { sender, receiver, origin, destination } = req.body;

  // Validation
  if (!sender || !receiver || !origin || !destination) {
    return res.status(400).json({ 
      error: "sender, receiver, origin, and destination are required." 
    });
  }

  const shipment = {
    id: uuidv4(),
    sender: sender.trim(),
    receiver: receiver.trim(),
    origin: origin.trim(),
    destination: destination.trim(),
    status: "Pending",
    createdAt: new Date(),
  };

  shipments.unshift(shipment); // Add to beginning for recent-first ordering
  res.status(201).json(shipment);
});

// PATCH /api/shipments/:id/status - Update shipment status
app.patch("/api/shipments/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  // Find and update shipment
  const idx = shipments.findIndex((s) => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Shipment not found." });
  }

  shipments[idx].status = status;
  res.json(shipments[idx]);
});

// ─── Start Server ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✓ Samex API running on http://localhost:${PORT}`);
  console.log(`✓ ${shipments.length} shipments seeded`);
});
