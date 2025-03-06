// server.js (Backend - Node.js + Express + MongoDB)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI = "mongodb+srv://Z1-Repo:<Kashyap_1998>@cluster0.plkss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const BuildSchema = new mongoose.Schema({
  serialNo: Number,
  environment: String,
  build: String,
  developer: String,
  qa: String,
});

const Build = mongoose.model('Build', BuildSchema);

// Get all builds
app.get('/api/builds', async (req, res) => {
  const builds = await Build.find();
  res.json(builds);
});

// Add new build
app.post('/api/builds', async (req, res) => {
  const { serialNo, environment, build, developer, qa } = req.body;
  const newBuild = new Build({ serialNo, environment, build, developer, qa });
  await newBuild.save();

  // Push to GitHub Repo
  const data = JSON.stringify({ serialNo, environment, build, developer, qa }, null, 2);
  const filePath = `builds/${Date.now()}.json`;

  try {
    await axios.put(
      `https://api.github.com/repos/Z1-Repo/Environments/contents/${filePath}`,
      {
        message: `New build added - ${build}`,
        content: Buffer.from(data).toString('base64'),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN = 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}`,
        },
      }
    );
  } catch (error) {
    console.error('GitHub Push Error:', error.response.data);
  }

  res.json({ message: 'Build added and pushed to GitHub' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
