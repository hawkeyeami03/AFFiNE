import { type Framework } from '@toeverything/infra';

import { WorkspaceLocalState, WorkspaceScope } from '../workspace';
import { ProjectsTasksService } from './services/projects-tasks';
import { ProjectsTasksStore } from './stores/projects-tasks';

export { ProjectsTasksService } from './services/projects-tasks';
export type { Project, ProjectsTasksData, Task, TaskSchedule } from './types';

export function configureProjectsTasksModule(framework: Framework) {
  framework
    .scope(WorkspaceScope)
    .store(ProjectsTasksStore, [WorkspaceLocalState])
    .service(ProjectsTasksService, [ProjectsTasksStore]);
}
