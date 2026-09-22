import { LiveData, Service } from '@toeverything/infra';
import { nanoid } from 'nanoid';
import { map } from 'rxjs';

import { createInitialProjectsTasksData } from '../seed';
import type { ProjectsTasksStore } from '../stores/projects-tasks';
import type { ProjectsTasksData, TaskSchedule } from '../types';

function normalizeName(name: string) {
  const normalized = name.trim();
  if (!normalized) {
    throw new Error('Project and task names cannot be empty.');
  }
  return normalized;
}

function normalizeSchedule(schedule: TaskSchedule): TaskSchedule {
  if (
    !Number.isFinite(schedule.startMinute) ||
    !Number.isFinite(schedule.endMinute) ||
    schedule.startMinute < 0 ||
    schedule.endMinute > 24 * 60 ||
    schedule.startMinute >= schedule.endMinute
  ) {
    throw new Error(
      'Task schedule must be within one day and end after it starts.'
    );
  }

  return {
    startMinute: Math.round(schedule.startMinute),
    endMinute: Math.round(schedule.endMinute),
  };
}

function isProjectsTasksData(
  data: ProjectsTasksData | undefined
): data is ProjectsTasksData {
  return data?.version === 1 && Array.isArray(data.projects);
}

export class ProjectsTasksService extends Service {
  readonly data$: LiveData<ProjectsTasksData>;
  readonly projects$: LiveData<ProjectsTasksData['projects']>;

  constructor(private readonly store: ProjectsTasksStore) {
    super();

    const stored = this.store.getData();
    const initial = isProjectsTasksData(stored)
      ? stored
      : createInitialProjectsTasksData();

    if (!isProjectsTasksData(stored)) {
      this.store.setData(initial);
    }

    this.data$ = LiveData.from(
      this.store
        .watchData()
        .pipe(map(data => (isProjectsTasksData(data) ? data : initial))),
      initial
    );
    this.projects$ = this.data$.map(data => data.projects);
  }

  setData(data: ProjectsTasksData) {
    this.store.setData(data);
  }

  createProject(name: string) {
    const id = nanoid();
    this.setData({
      ...this.data$.value,
      projects: [
        ...this.data$.value.projects,
        { id, name: normalizeName(name), tasks: [] },
      ],
    });
    return id;
  }

  renameProject(projectId: string, name: string) {
    this.setData({
      ...this.data$.value,
      projects: this.data$.value.projects.map(project =>
        project.id === projectId
          ? { ...project, name: normalizeName(name) }
          : project
      ),
    });
  }

  deleteProject(projectId: string) {
    this.setData({
      ...this.data$.value,
      projects: this.data$.value.projects.filter(
        project => project.id !== projectId
      ),
    });
  }

  createTask(projectId: string, name: string, schedule: TaskSchedule) {
    const id = nanoid();
    const normalizedName = normalizeName(name);
    const normalizedSchedule = normalizeSchedule(schedule);
    let projectFound = false;

    const projects = this.data$.value.projects.map(project => {
      if (project.id !== projectId) return project;
      projectFound = true;
      return {
        ...project,
        tasks: [
          ...project.tasks,
          {
            id,
            projectId,
            name: normalizedName,
            schedule: normalizedSchedule,
          },
        ],
      };
    });

    if (!projectFound) {
      throw new Error(`Project ${projectId} does not exist.`);
    }

    this.setData({ ...this.data$.value, projects });
    return id;
  }

  updateTask(
    projectId: string,
    taskId: string,
    name: string,
    schedule: TaskSchedule
  ) {
    const normalizedName = normalizeName(name);
    const normalizedSchedule = normalizeSchedule(schedule);
    this.setData({
      ...this.data$.value,
      projects: this.data$.value.projects.map(project =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      name: normalizedName,
                      schedule: normalizedSchedule,
                    }
                  : task
              ),
            }
          : project
      ),
    });
  }

  deleteTask(projectId: string, taskId: string) {
    this.setData({
      ...this.data$.value,
      projects: this.data$.value.projects.map(project =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter(task => task.id !== taskId),
            }
          : project
      ),
    });
  }
}
