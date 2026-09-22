import type { ProjectsTasksData } from './types';

export function createInitialProjectsTasksData(): ProjectsTasksData {
  return {
    version: 1,
    projects: [
      {
        id: 'alpha',
        name: 'Project Alpha',
        tasks: [
          {
            id: 'planning',
            projectId: 'alpha',
            name: 'Planning',
            schedule: { startMinute: 360, endMinute: 450 },
          },
        ],
      },
      {
        id: 'beta',
        name: 'Project Beta',
        tasks: [
          {
            id: 'research',
            projectId: 'beta',
            name: 'Research',
            schedule: { startMinute: 480, endMinute: 600 },
          },
          {
            id: 'design',
            projectId: 'beta',
            name: 'Design',
            schedule: { startMinute: 570, endMinute: 720 },
          },
          {
            id: 'prototype',
            projectId: 'beta',
            name: 'Prototype',
            schedule: { startMinute: 660, endMinute: 870 },
          },
        ],
      },
      {
        id: 'execution',
        name: 'Phase 3: Execution',
        tasks: [
          {
            id: 'implementation',
            projectId: 'execution',
            name: 'Implementation',
            schedule: { startMinute: 870, endMinute: 1020 },
          },
        ],
      },
      {
        id: 'review',
        name: 'Final Review',
        tasks: [
          {
            id: 'review-task',
            projectId: 'review',
            name: 'Review',
            schedule: { startMinute: 1020, endMinute: 1080 },
          },
        ],
      },
    ],
  };
}
