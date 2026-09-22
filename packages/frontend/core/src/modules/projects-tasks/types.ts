export type TaskSchedule = {
  startMinute: number;
  endMinute: number;
};

export type Task = {
  id: string;
  projectId: string;
  name: string;
  schedule: TaskSchedule;
};

export type Project = {
  id: string;
  name: string;
  tasks: readonly Task[];
};

export type ProjectsTasksData = {
  version: 1;
  projects: readonly Project[];
};
