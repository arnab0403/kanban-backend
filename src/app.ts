import express from "express";
import cors from "cors";
import taskRoutes from "./task/task.routes.ts";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use("/api", taskRoutes);

export default app;
