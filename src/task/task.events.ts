import { EventEmitter } from "node:events";

export const TASK_EVENTS = {
  CREATED: "task:created",
  UPDATED: "task:updated",
  DELETED: "task:deleted",
} as const;

export const taskEvents = new EventEmitter();
