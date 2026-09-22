export type TaskRow = {
  type: 'task';
  id: string;
  projectId: string;
  name: string;
  startMinute: number;
  endMinute: number;
};

export type ProjectRow = {
  type: 'project';
  id: string;
  name: string;
};

export type TimelineRow = ProjectRow | TaskRow;
type MockProject = ProjectRow & { tasks: TaskRow[] };

export const ROW_HEIGHT = 44;
export const HEADER_HEIGHT = 48;
export const HOUR_WIDTH = 96;
export const DAY_WIDTH = 24 * HOUR_WIDTH;
// Leave room for the final 24:00 label at the right edge.
export const TIMELINE_WIDTH = DAY_WIDTH + 56;
export const HOURS = Array.from({ length: 25 }, (_, hour) => hour);

const projects: MockProject[] = [
  {
    type: 'project',
    id: 'alpha',
    name: 'Project Alpha',
    tasks: [
      {
        type: 'task',
        id: 'planning',
        projectId: 'alpha',
        name: 'Planning',
        startMinute: 360,
        endMinute: 450,
      },
    ],
  },
  {
    type: 'project',
    id: 'beta',
    name: 'Project Beta',
    tasks: [
      {
        type: 'task',
        id: 'research',
        projectId: 'beta',
        name: 'Research',
        startMinute: 480,
        endMinute: 600,
      },
      {
        type: 'task',
        id: 'design',
        projectId: 'beta',
        name: 'Design',
        startMinute: 570,
        endMinute: 720,
      },
      {
        type: 'task',
        id: 'prototype',
        projectId: 'beta',
        name: 'Prototype',
        startMinute: 660,
        endMinute: 870,
      },
    ],
  },
  {
    type: 'project',
    id: 'execution',
    name: 'Phase 3: Execution',
    tasks: [
      {
        type: 'task',
        id: 'implementation',
        projectId: 'execution',
        name: 'Implementation',
        startMinute: 870,
        endMinute: 1020,
      },
    ],
  },
  {
    type: 'project',
    id: 'review',
    name: 'Final Review',
    tasks: [
      {
        type: 'task',
        id: 'review-task',
        projectId: 'review',
        name: 'Review',
        startMinute: 1020,
        endMinute: 1080,
      },
    ],
  },
];

export function getVisibleRows(expanded: ReadonlySet<string>): TimelineRow[] {
  return projects.flatMap<TimelineRow>(project => [
    project,
    ...(expanded.has(project.id) ? project.tasks : []),
  ]);
}

export function minuteToX(minute: number) {
  return (minute / 60) * HOUR_WIDTH;
}

export function formatMinute(minute: number) {
  return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
}
