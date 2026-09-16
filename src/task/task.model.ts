export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  status: string;
  position: number;
  version: number;
  updatedAt: string;
}

export type CreateTaskInput = Omit<Task, "id" | "updatedAt" | "position" | "version"> & {
  position?: number;
};

export type UpdateTaskInput = Partial<Omit<Task, "id" | "version">>;
