export type Priority = 'Low' | 'Medium' | 'High';

export interface Step {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string format
  isCompleted: boolean;
  priority: Priority;
  steps: Step[];
  progress: number;
}
