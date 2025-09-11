import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// catch-all route handler for any requests to an unknown route
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
