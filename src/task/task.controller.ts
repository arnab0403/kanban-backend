import type { Request, Response } from "express";
import { taskService } from "./task.service.ts";
import { TASK_EVENTS, taskEvents } from "./task.events.ts";

// GET /api/board - returns all tasks grouped by status
function getBoard(req: Request, res: Response): void {
  try {
    const board = taskService.getBoard();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Failed to load board" });
  }
}

// POST /api/tasks - creates a new task
function createTask(req: Request, res: Response): void {
  try {
    const task = taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
}

// PATCH /api/tasks/:id - partially updates a task
function updateTask(req: Request<{ id: string }>, res: Response): void {
  try {
    const task = taskService.updateTask(req.params.id, req.body);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
}

// DELETE /api/tasks/:id - deletes a task
function deleteTask(req: Request<{ id: string }>, res: Response): void {
  try {
    const deleted = taskService.deleteTask(req.params.id);

    if (!deleted) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
}

// GET /api/events - streams task create/update/delete events via SSE
function streamEvents(req: Request, res: Response): void {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const onCreated = (task: unknown) => send(TASK_EVENTS.CREATED, task);
  const onUpdated = (task: unknown) => send(TASK_EVENTS.UPDATED, task);
  const onDeleted = (payload: unknown) => send(TASK_EVENTS.DELETED, payload);

  taskEvents.on(TASK_EVENTS.CREATED, onCreated);
  taskEvents.on(TASK_EVENTS.UPDATED, onUpdated);
  taskEvents.on(TASK_EVENTS.DELETED, onDeleted);

  req.on("close", () => {
    taskEvents.off(TASK_EVENTS.CREATED, onCreated);
    taskEvents.off(TASK_EVENTS.UPDATED, onUpdated);
    taskEvents.off(TASK_EVENTS.DELETED, onDeleted);
    res.end();
  });
}

export const taskController = {
  getBoard,
  createTask,
  updateTask,
  deleteTask,
  streamEvents,
};
