// server.js
require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // allow requests from your frontend (GitHub Pages)

const PORT = process.env.PORT || 3000;

// IBM Cloud API Key (store securely in .env)
const IBM_API_KEY = process.env.IBM_API_KEY;
const ORCHESTRATE_INSTANCE_URL = process.env.ORCHESTRATE_INSTANCE_URL; 
// e.g. "https://api.eu-gb.watson-orchestrate.cloud.ibm.com/instances/c83567fe-8d32-4f0a-81d4-72627bf337b4"

// Endpoint to generate short-lived JWT token
app.get("/get-token", async (req, res) => {
  try {
    const response = await axios.post(
      `${ORCHESTRATE_INSTANCE_URL}/v1/embedded-tokens`,
      {},
      {
        headers: {
          "Authorization": `Bearer ${IBM_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ token: response.data.token });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
