const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI CRM Backend is Running");
});

app.get("/api/insights", (req, res) => {
  res.json({
    message: "AI Insight: Focus on active leads to improve customer conversions."
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});