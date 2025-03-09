const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Define Schema and Model
const recordSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "frontend" or "backend"
  environment: { type: String, required: true },
  build: { type: String, required: true },
  developer: { type: String, required: true },
  qa: { type: String, required: true },
});

const Record = mongoose.model("Record", recordSchema);

// Serve HTML Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API to Add Record
app.post("/addRecord", async (req, res) => {
  try {
    const { type, environment, build, developer, qa } = req.body;
    if (!type || !environment || !build || !developer || !qa) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newRecord = new Record({ type, environment, build, developer, qa });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to Update Record
app.put("/updateRecord/:id", async (req, res) => {
  try {
    const { environment, build, developer, qa } = req.body;
    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      { environment, build, developer, qa },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "✅ Record updated successfully", updatedRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to Get All Records
app.get("/getRecords", async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to Delete Record
app.delete("/deleteRecord/:id", async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle unknown routes to serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
