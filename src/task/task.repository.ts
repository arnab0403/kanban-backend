import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { Task } from "./task.model.ts";

const dataFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "data.json");
const tasks: Task[] = JSON.parse(readFileSync(dataFile, "utf-8"));

function findAll(): Task[] {
  return tasks;
}

function findById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id);
}

function create(task: Task): Task {
  tasks.push(task);
  return task;
}

function update(id: string, changes: Partial<Task>): Task | undefined {
  const task = findById(id);
  if (!task) {
    return undefined;
  }

  Object.assign(task, changes);
  return task;
}

function remove(id: string): boolean {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  return true;
}

export const taskRepository = { findAll, findById, create, update, remove };
