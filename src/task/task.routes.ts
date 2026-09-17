import { Router } from "express";
import { taskController } from "./task.controller.ts";

const router = Router();

router.get("/board", taskController.getBoard);
router.get("/user", taskController.getUsers);
router.post("/tasks", taskController.createTask);
router.patch("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);
router.get("/events", taskController.streamEvents);

export default router;
