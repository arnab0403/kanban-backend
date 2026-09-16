import { randomUUID } from "node:crypto";
import { taskRepository } from "./task.repository.ts";
import { TASK_EVENTS, taskEvents } from "./task.events.ts";
import type { CreateTaskInput, Task, UpdateTaskInput } from "./task.model.ts";

function getBoard(): Record<string, Task[]> {
  // TODO: add business logic (e.g. column ordering, filtering, permissions)
  const board: Record<string, Task[]> = {};

  for (const task of taskRepository.findAll()) {
    (board[task.status] ??= []).push(task);
  }

  for (const status of Object.keys(board)) {
    board[status]!.sort((a, b) => a.position - b.position);
  }

  return board;
}

function createTask(input: CreateTaskInput): Task {
  // TODO: add business logic (e.g. validation, default status/position rules)
  const task: Task = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    priority: input.priority,
    assignee: input.assignee,
    status: input.status,
    position: input.position ?? 0,
    updatedAt: new Date().toISOString(),
  };

  taskRepository.create(task);
  taskEvents.emit(TASK_EVENTS.CREATED, task);
  return task;
}

function updateTask(id: string, changes: UpdateTaskInput): Task | undefined {
  // TODO: add business logic (e.g. validation, status transition rules)
  const task = taskRepository.update(id, {
    ...changes,
    updatedAt: new Date().toISOString(),
  });

  if (!task) {
    return undefined;
  }

  taskEvents.emit(TASK_EVENTS.UPDATED, task);
  return task;
}

function deleteTask(id: string): boolean {
  // TODO: add business logic (e.g. permission checks, cascading cleanup)
  const deleted = taskRepository.remove(id);

  if (deleted) {
    taskEvents.emit(TASK_EVENTS.DELETED, { id });
  }

  return deleted;
}

export const taskService = { getBoard, createTask, updateTask, deleteTask };
