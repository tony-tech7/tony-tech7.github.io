// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // loads .env

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const IBM_API_KEY = process.env.IBM_API_KEY;

if (!IBM_API_KEY) {
  console.error("IBM_API_KEY not found in .env!");
  process.exit(1);
}

app.get("/get-token", async (req, res) => {
  try {
    const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${IBM_API_KEY}`,
    });

    const data = await response.json();

    if (!data.access_token) {
      console.error("No token returned:", data);
      return res.status(500).json({ error: "Failed to get IAM token" });
    }

    res.json({ token: data.access_token });
  } catch (err) {
    console.error("Error generating token:", err);
    res.status(500).json({ error: "Server error generating token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

