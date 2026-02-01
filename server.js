// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Replace with your IBM Cloud details
const IBM_API_KEY = process.env.IBM_API_KEY;
const REGION = "eu-gb"; // your region
const INSTANCE_ID = "c83567fe-8d32-4f0a-81d4-72627bf337b4";

app.get("/get-token", async (req, res) => {
  try {
    // Request IAM token from IBM
    const tokenResponse = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${IBM_API_KEY}`,
    });

    const data = await tokenResponse.json();

    if (!data.access_token) {
      return res.status(500).json({ error: "Failed to get IAM token" });
    }

    res.json({ token: data.access_token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error generating token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
