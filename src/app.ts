import express from "express";
import taskRoutes from "./task/task.routes.ts";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use("/api", taskRoutes);

export default app;
