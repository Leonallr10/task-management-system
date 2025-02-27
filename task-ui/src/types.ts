

export interface TaskExecution {
  startTime: string;
  endTime: string;
  output: string;
}
// ../types.ts
// task-ui/src/types.ts
export interface Task {
  id: string;
  name: string;
  owner: string;
  command: string;
}

export interface TaskFormData {
  id: string;
  name: string;
  owner: string;
  command: string;
}