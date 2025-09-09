import express from "express";

const app = express();

// catch-all route handler for any requests to an unknown route
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
