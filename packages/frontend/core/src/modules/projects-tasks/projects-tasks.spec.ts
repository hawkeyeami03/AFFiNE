import { Framework, MemoryMemento } from '@toeverything/infra';
import { describe, expect, test } from 'vitest';

import type { WorkspaceLocalState } from '../workspace';
import { createInitialProjectsTasksData } from './seed';
import { ProjectsTasksService } from './services/projects-tasks';
import {
  PROJECTS_TASKS_STORAGE_KEY,
  ProjectsTasksStore,
} from './stores/projects-tasks';
import type { ProjectsTasksData } from './types';

function createService(state: WorkspaceLocalState) {
  const framework = new Framework();
  framework
    .store(ProjectsTasksStore, () => new ProjectsTasksStore(state))
    .service(ProjectsTasksService, [ProjectsTasksStore]);
  return framework.provider().get(ProjectsTasksService);
}

describe('ProjectsTasksService', () => {
  test('seeds an empty workspace once', () => {
    const state = new MemoryMemento();
    const service = createService(state);

    expect(service.data$.value).toEqual(createInitialProjectsTasksData());
    expect(state.get(PROJECTS_TASKS_STORAGE_KEY)).toEqual(
      createInitialProjectsTasksData()
    );
  });

  test('keeps existing workspace data', () => {
    const state = new MemoryMemento();
    const stored: ProjectsTasksData = {
      version: 1,
      projects: [{ id: 'saved', name: 'Saved project', tasks: [] }],
    };
    state.set(PROJECTS_TASKS_STORAGE_KEY, stored);

    const service = createService(state);

    expect(service.data$.value).toEqual(stored);
    expect(state.get(PROJECTS_TASKS_STORAGE_KEY)).toEqual(stored);
  });

  test('creates, renames, and deletes a project', () => {
    const state = new MemoryMemento();
    const service = createService(state);

    const projectId = service.createProject('  Launch plan  ');
    expect(service.data$.value.projects.at(-1)).toEqual({
      id: projectId,
      name: 'Launch plan',
      tasks: [],
    });

    service.renameProject(projectId, 'Release plan');
    expect(
      service.data$.value.projects.find(project => project.id === projectId)
        ?.name
    ).toBe('Release plan');

    service.deleteProject(projectId);
    expect(
      service.data$.value.projects.some(project => project.id === projectId)
    ).toBe(false);
  });

  test('creates, updates, and deletes a task', () => {
    const state = new MemoryMemento();
    const service = createService(state);
    const projectId = service.createProject('Launch plan');

    const taskId = service.createTask(projectId, ' Research ', {
      startMinute: 8 * 60,
      endMinute: 10 * 60,
    });
    expect(
      service.data$.value.projects.find(project => project.id === projectId)
        ?.tasks
    ).toEqual([
      {
        id: taskId,
        projectId,
        name: 'Research',
        schedule: { startMinute: 480, endMinute: 600 },
      },
    ]);

    service.updateTask(projectId, taskId, 'Discovery', {
      startMinute: 9 * 60,
      endMinute: 11 * 60,
    });
    expect(
      service.data$.value.projects.find(project => project.id === projectId)
        ?.tasks[0]
    ).toMatchObject({
      name: 'Discovery',
      schedule: { startMinute: 540, endMinute: 660 },
    });

    service.deleteTask(projectId, taskId);
    expect(
      service.data$.value.projects.find(project => project.id === projectId)
        ?.tasks
    ).toEqual([]);
  });
});
