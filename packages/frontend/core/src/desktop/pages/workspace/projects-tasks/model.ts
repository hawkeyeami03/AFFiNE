import type {
  Project,
  Task,
  TaskSchedule,
} from '@affine/core/modules/projects-tasks';

export type TimelineRow =
  | { type: 'project'; id: string; project: Project }
  | { type: 'task'; id: string; projectId: string; task: Task };

export const ROW_HEIGHT = 44;
export const HEADER_HEIGHT = 48;
export const HOUR_WIDTH = 96;
export const DAY_WIDTH = 24 * HOUR_WIDTH;
// Leave room for the final 24:00 label at the right edge.
export const TIMELINE_WIDTH = DAY_WIDTH + 56;
export const HOURS = Array.from({ length: 25 }, (_, hour) => hour);

export function getVisibleRows(
  projects: readonly Project[],
  expanded: ReadonlySet<string>
): TimelineRow[] {
  return projects.flatMap<TimelineRow>(project => [
    { type: 'project', id: project.id, project },
    ...(expanded.has(project.id)
      ? project.tasks.map(task => ({
          type: 'task' as const,
          id: task.id,
          projectId: project.id,
          task,
        }))
      : []),
  ]);
}

export function minuteToX(minute: number, hourWidth = HOUR_WIDTH) {
  return (minute / 60) * hourWidth;
}

export function durationToWidth(schedule: TaskSchedule) {
  return minuteToX(schedule.endMinute - schedule.startMinute);
}

export function getInitialTimelineMinute(rows: readonly TimelineRow[]) {
  const taskStarts = rows
    .filter(
      (row): row is Extract<TimelineRow, { type: 'task' }> =>
        row.type === 'task'
    )
    .map(row => row.task.schedule.startMinute);

  return taskStarts.length > 0 ? Math.min(...taskStarts) : 0;
}

export function formatMinute(minute: number) {
  return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
}
