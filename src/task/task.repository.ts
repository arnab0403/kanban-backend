import type { Task } from "./task.model.ts";

// Runtime-only storage. All data is lost when the server stops.
const tasks: Task[] = [
  {
    id: "1",
    title: "Set up project repo",
    description: "Initialize the repository and base folder structure",
    priority: "high",
    assignee: "Ayush",
    status: "done",
    position: 1,
    version: 1,
    updatedAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: "2",
    title: "Design task model",
    description: "Define the Task type and API contract",
    priority: "medium",
    assignee: "Ayush",
    status: "in-progress",
    position: 1,
    version: 1,
    updatedAt: "2026-09-12T11:30:00.000Z",
  },
  {
    id: "3",
    title: "Build board UI",
    description: "Create the drag-and-drop Kanban board on the frontend",
    priority: "medium",
    assignee: "Riya",
    status: "todo",
    position: 1,
    version: 1,
    updatedAt: "2026-09-13T15:45:00.000Z",
  },
  {
    id: "4",
    title: "Write API docs",
    description: "Document the task endpoints for the frontend team",
    priority: "low",
    assignee: "Riya",
    status: "todo",
    position: 2,
    version: 1,
    updatedAt: "2026-09-14T08:20:00.000Z",
  },
];

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
