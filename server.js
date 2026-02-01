// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" })); // allow frontend to fetch

const PORT = process.env.PORT || 3000;
const IBM_API_KEY = process.env.IBM_API_KEY;
const ORCHESTRATE_INSTANCE_URL = process.env.ORCHESTRATE_INSTANCE_URL;

// Endpoint to generate short-lived token
app.get("/get-token", async (req, res) => {
  try {
    const response = await axios.post(
      `${ORCHESTRATE_INSTANCE_URL}/v1/tokens`,
      {},
      {
        auth: {
          username: "apikey",
          password: IBM_API_KEY
        }
      }
    );

    res.json({ token: response.data.token });
  } catch (err) {
    console.error("Error generating token:", err.message, err.response?.data);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
