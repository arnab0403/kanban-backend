import { randomUUID } from "node:crypto";
import { taskRepository } from "./task.repository.ts";
import { TASK_EVENTS, taskEvents } from "./task.events.ts";
import type { CreateTaskInput, Task, UpdateTaskInput } from "./task.model.ts";

function getBoard(): Task[] {
  return taskRepository
    .findAll()
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
}

function createTask(input: CreateTaskInput): Task {
  const payload = input as Partial<CreateTaskInput>;
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  const assignee = typeof payload.assignee === "string" ? payload.assignee.trim() : "";
  const priority = payload.priority;
  const status = typeof payload.status === "string" && payload.status.trim()
    ? payload.status.trim()
    : "todo";

  if (!title) {
    throw new Error("Task title is required");
  }

  if (priority !== "low" && priority !== "medium" && priority !== "high") {
    throw new Error("Task priority must be low, medium, or high");
  }

  if (payload.position !== undefined &&
      (!Number.isInteger(payload.position) || payload.position < 0)) {
    throw new Error("Task position must be a non-negative integer");
  }

  const position = payload.position ?? taskRepository
    .findAll()
    .filter((task) => task.status === status)
    .reduce((highest, task) => Math.max(highest, task.position), 0) + 1;

  const task: Task = {
    id: randomUUID(),
    title,
    description,
    priority,
    assignee,
    status,
    position,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  // Save the new task to the repository.
  taskRepository.create(task);
  // Emit an event to notify subscribers that a new task has been created.
  taskEvents.emit(TASK_EVENTS.CREATED, task);
  return task;
}

function updateTask(id: string, changes: UpdateTaskInput): Task | undefined {
  // Only editable fields are copied from the request body. In particular,
  // clients cannot change a task's id or server-managed updatedAt value.
  const editableChanges: UpdateTaskInput = {};

  if (changes.title !== undefined) editableChanges.title = changes.title;
  if (changes.description !== undefined) editableChanges.description = changes.description;
  if (changes.priority !== undefined) editableChanges.priority = changes.priority;
  if (changes.assignee !== undefined) editableChanges.assignee = changes.assignee;
  if (changes.status !== undefined) editableChanges.status = changes.status;
  if (changes.position !== undefined) editableChanges.position = changes.position;

  const existingTask = taskRepository.findById(id);
  if (!existingTask) {
    return undefined;
  }

  // Update the task in the repository with the new values, incrementing the version and updating the timestamp.
  const task = taskRepository.update(id, {
    ...editableChanges,
    version: existingTask.version + 1,
    updatedAt: new Date().toISOString(),
  });

  if (!task) {
    return undefined;
  }


  // Emit an event to notify subscribers that a task has been updated.
  taskEvents.emit(TASK_EVENTS.UPDATED, task);
  return task;
}

function deleteTask(id: string): boolean {
  // TODO: add business logic (e.g. permission checks, cascading cleanup)
  const deleted = taskRepository.remove(id);

  if (deleted) {
    // Emit an event to notify subscribers that a task has been deleted.
    taskEvents.emit(TASK_EVENTS.DELETED, { id });
  }

  return deleted;
}

export const taskService = { getBoard, createTask, updateTask, deleteTask };
