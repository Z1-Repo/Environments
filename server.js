const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://Z1-Repo:Kashyap_1998@cluster0.plkss.mongodb.net/environmentDB?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const RecordSchema = new mongoose.Schema({
    environment: String,
    build: String,
    developer: String,
    qa: String,
});

const FrontendRecord = mongoose.model("FrontendRecord", RecordSchema);
const BackendRecord = mongoose.model("BackendRecord", RecordSchema);

// API to get records
app.get("/api/frontend", async (req, res) => {
    const records = await FrontendRecord.find();
    res.json(records);
});

app.get("/api/backend", async (req, res) => {
    const records = await BackendRecord.find();
    res.json(records);
});

// API to add records
app.post("/api/frontend", async (req, res) => {
    const newRecord = new FrontendRecord(req.body);
    await newRecord.save();
    res.json(newRecord);
});

app.post("/api/backend", async (req, res) => {
    const newRecord = new BackendRecord(req.body);
    await newRecord.save();
    res.json(newRecord);
});

// API to delete records
app.delete("/api/frontend/:id", async (req, res) => {
    await FrontendRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
});

app.delete("/api/backend/:id", async (req, res) => {
    await BackendRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
