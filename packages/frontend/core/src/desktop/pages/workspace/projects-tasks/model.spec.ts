import { createInitialProjectsTasksData } from '@affine/core/modules/projects-tasks/seed';
import { describe, expect, test } from 'vitest';

import {
  durationToWidth,
  getInitialTimelineMinute,
  getVisibleRows,
  minuteToX,
} from './model';

describe('projects and tasks timeline model', () => {
  const projects = createInitialProjectsTasksData().projects;

  test('derives project and task rows in one stable order', () => {
    const rows = getVisibleRows(projects, new Set(['beta']));

    expect(rows.map(row => row.id)).toEqual([
      'alpha',
      'beta',
      'research',
      'design',
      'prototype',
      'execution',
      'review',
    ]);
    expect(getInitialTimelineMinute(rows)).toBe(480);
  });

  test('converts task schedules to timeline pixels', () => {
    const rows = getVisibleRows(projects, new Set(['beta']));
    const research = rows.find(row => row.id === 'research');

    expect(research?.type).toBe('task');
    if (research?.type !== 'task') return;

    expect(minuteToX(research.task.schedule.startMinute)).toBe(768);
    expect(durationToWidth(research.task.schedule)).toBe(192);
  });
});
