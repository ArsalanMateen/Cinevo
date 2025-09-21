import express from "express";
import cors from "cors";
import movies from "./routes/movies.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Working" });
});

app.use("/api/v1/movies", movies);

// catch-all route handler for any requests to an unknown route
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
