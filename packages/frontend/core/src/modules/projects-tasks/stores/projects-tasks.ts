import { Store } from '@toeverything/infra';

import type { WorkspaceLocalState } from '../../workspace';
import type { ProjectsTasksData } from '../types';

export const PROJECTS_TASKS_STORAGE_KEY = 'projects-tasks:v1';

export class ProjectsTasksStore extends Store {
  constructor(private readonly workspaceLocalState: WorkspaceLocalState) {
    super();
  }

  getData() {
    return this.workspaceLocalState.get<ProjectsTasksData>(
      PROJECTS_TASKS_STORAGE_KEY
    );
  }

  watchData() {
    return this.workspaceLocalState.watch<ProjectsTasksData>(
      PROJECTS_TASKS_STORAGE_KEY
    );
  }

  setData(data: ProjectsTasksData) {
    this.workspaceLocalState.set(PROJECTS_TASKS_STORAGE_KEY, data);
  }
}
