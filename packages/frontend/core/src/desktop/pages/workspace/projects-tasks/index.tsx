import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuSeparator,
  Scrollable,
  useConfirmModal,
} from '@affine/component';
import { Header } from '@affine/core/components/pure/header';
import {
  type Project,
  ProjectsTasksService,
  type Task,
} from '@affine/core/modules/projects-tasks';
import {
  ViewBody,
  ViewHeader,
  ViewIcon,
  ViewTitle,
} from '@affine/core/modules/workbench';
import { useI18n } from '@affine/i18n';
import {
  ArrowDownSmallIcon,
  DeleteIcon,
  EditIcon,
  MoreHorizontalIcon,
  PageIcon,
  PlusIcon,
  ViewLayersIcon,
} from '@blocksuite/icons/rc';
import { useLiveData, useService } from '@toeverything/infra';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ProjectsTasksEditorModal } from './editor-modal';
import * as styles from './index.css';
import {
  durationToWidth,
  formatMinute,
  getInitialTimelineMinute,
  getVisibleRows,
  HOUR_WIDTH,
  HOURS,
  minuteToX,
} from './model';

type EditorState =
  | { kind: 'create-project' }
  | { kind: 'rename-project'; project: Project }
  | { kind: 'create-task'; project: Project }
  | { kind: 'edit-task'; projectId: string; task: Task };

const CurrentTimeIndicator = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      if (ref.current) {
        ref.current.style.left = `${minuteToX(now.getHours() * 60 + now.getMinutes())}px`;
        ref.current.title = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return <div ref={ref} className={styles.currentTime} aria-hidden="true" />;
};

export const Component = () => {
  const t = useI18n();
  const projectsTasksService = useService(ProjectsTasksService);
  const { openConfirmModal } = useConfirmModal();
  const projects = useLiveData(projectsTasksService.projects$);
  const title = t['com.affine.workspaceSubPath.projects-tasks']();
  const [expanded, setExpanded] = useState(() => new Set(['beta']));
  const [editor, setEditor] = useState<EditorState | null>(null);
  const rows = useMemo(
    () => getVisibleRows(projects, expanded),
    [expanded, projects]
  );
  const timelineRef = useRef<HTMLElement>(null);
  const timeHeaderRef = useRef<HTMLDivElement>(null);
  const initializedScrollRef = useRef(false);

  const syncTimeHeader = useCallback((scrollLeft: number) => {
    if (timeHeaderRef.current) {
      timeHeaderRef.current.style.transform = `translateX(${-scrollLeft}px)`;
    }
  }, []);

  useEffect(() => {
    if (initializedScrollRef.current) return;

    const frame = requestAnimationFrame(() => {
      if (!timelineRef.current) return;

      const firstTaskMinute = getInitialTimelineMinute(rows);
      const scrollLeft = Math.max(0, minuteToX(firstTaskMinute) - HOUR_WIDTH);
      timelineRef.current.scrollLeft = scrollLeft;
      syncTimeHeader(scrollLeft);
      initializedScrollRef.current = true;
    });

    return () => cancelAnimationFrame(frame);
  }, [rows, syncTimeHeader]);

  const toggleProject = (id: string) => {
    setExpanded(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteProject = useCallback(
    (project: Project) => {
      openConfirmModal({
        title: t['com.affine.projects-tasks.delete-project'](),
        description: t['com.affine.projects-tasks.delete-project-description']({
          name: project.name,
        }),
        confirmText: t['Delete'](),
        confirmButtonOptions: { variant: 'error' },
        onConfirm: () => projectsTasksService.deleteProject(project.id),
      });
    },
    [openConfirmModal, projectsTasksService, t]
  );

  const deleteTask = useCallback(
    (projectId: string, task: Task) => {
      openConfirmModal({
        title: t['com.affine.projects-tasks.delete-task'](),
        description: t['com.affine.projects-tasks.delete-task-description']({
          name: task.name,
        }),
        confirmText: t['Delete'](),
        confirmButtonOptions: { variant: 'error' },
        onConfirm: () => projectsTasksService.deleteTask(projectId, task.id),
      });
    },
    [openConfirmModal, projectsTasksService, t]
  );

  return (
    <>
      <ViewTitle title={title} />
      <ViewIcon icon="collection" />
      <ViewHeader>
        <Header
          left={<h1 className={styles.heading}>{title}</h1>}
          right={
            <Button
              variant="primary"
              prefix={<PlusIcon />}
              onClick={() => setEditor({ kind: 'create-project' })}
            >
              {t['com.affine.projects-tasks.new-project']()}
            </Button>
          }
        />
      </ViewHeader>
      <ViewBody>
        <div className={styles.body}>
          <div className={styles.scheduler}>
            <h2 className={styles.treeHeader}>{title}</h2>
            <div className={styles.timelineHeader}>
              <div ref={timeHeaderRef} className={styles.timeHeader}>
                {HOURS.map(hour => (
                  <span
                    key={hour}
                    className={styles.hourLabel}
                    style={{ left: minuteToX(hour * 60) }}
                  >
                    {formatMinute(hour * 60)}
                  </span>
                ))}
              </div>
            </div>
            <Scrollable.Root className={styles.rowsScroller}>
              <Scrollable.Viewport>
                <div className={styles.rowGrid}>
                  <section
                    className={styles.projects}
                    aria-label={t['com.affine.projects-tasks.projects']()}
                  >
                    {rows.map(row => (
                      <div
                        key={row.id}
                        className={styles.treeRow}
                        data-row-type={row.type}
                      >
                        {row.type === 'project' ? (
                          <>
                            <IconButton
                              size="16"
                              aria-label={row.project.name}
                              aria-expanded={expanded.has(row.id)}
                              onClick={() => toggleProject(row.id)}
                            >
                              <ArrowDownSmallIcon
                                className={styles.chevron}
                                data-expanded={expanded.has(row.id)}
                              />
                            </IconButton>
                            <ViewLayersIcon
                              className={styles.rowIcon}
                              aria-hidden="true"
                            />
                          </>
                        ) : (
                          <PageIcon
                            className={styles.rowIcon}
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={styles.rowName}
                          title={
                            row.type === 'project'
                              ? row.project.name
                              : row.task.name
                          }
                        >
                          {row.type === 'project'
                            ? row.project.name
                            : row.task.name}
                        </span>
                        <Menu
                          rootOptions={{ modal: false }}
                          items={
                            row.type === 'project' ? (
                              <>
                                <MenuItem
                                  prefixIcon={<PlusIcon />}
                                  onSelect={() => {
                                    setExpanded(previous =>
                                      new Set(previous).add(row.project.id)
                                    );
                                    setEditor({
                                      kind: 'create-task',
                                      project: row.project,
                                    });
                                  }}
                                >
                                  {t['com.affine.projects-tasks.add-task']()}
                                </MenuItem>
                                <MenuItem
                                  prefixIcon={<EditIcon />}
                                  onSelect={() =>
                                    setEditor({
                                      kind: 'rename-project',
                                      project: row.project,
                                    })
                                  }
                                >
                                  {t['Rename']()}
                                </MenuItem>
                                <MenuSeparator />
                                <MenuItem
                                  type="danger"
                                  prefixIcon={<DeleteIcon />}
                                  onSelect={() => deleteProject(row.project)}
                                >
                                  {t['Delete']()}
                                </MenuItem>
                              </>
                            ) : (
                              <>
                                <MenuItem
                                  prefixIcon={<EditIcon />}
                                  onSelect={() =>
                                    setEditor({
                                      kind: 'edit-task',
                                      projectId: row.projectId,
                                      task: row.task,
                                    })
                                  }
                                >
                                  {t['Edit']()}
                                </MenuItem>
                                <MenuSeparator />
                                <MenuItem
                                  type="danger"
                                  prefixIcon={<DeleteIcon />}
                                  onSelect={() =>
                                    deleteTask(row.projectId, row.task)
                                  }
                                >
                                  {t['Delete']()}
                                </MenuItem>
                              </>
                            )
                          }
                        >
                          <IconButton
                            className={styles.rowActions}
                            size="24"
                            aria-label={t[
                              'com.affine.projects-tasks.row-actions'
                            ]()}
                          >
                            <MoreHorizontalIcon />
                          </IconButton>
                        </Menu>
                      </div>
                    ))}
                  </section>
                  <section
                    ref={timelineRef}
                    className={styles.timeline}
                    aria-label={t['com.affine.projects-tasks.timeline']()}
                    tabIndex={0}
                    onScroll={event =>
                      syncTimeHeader(event.currentTarget.scrollLeft)
                    }
                  >
                    <div className={styles.timelineContent}>
                      <div className={styles.grid}>
                        {rows.map(row => (
                          <div
                            key={row.id}
                            className={styles.timelineRow}
                            data-row-type={row.type}
                          >
                            {row.type === 'task' && (
                              <div
                                className={styles.taskBar}
                                style={{
                                  left: minuteToX(
                                    row.task.schedule.startMinute
                                  ),
                                  width: durationToWidth(row.task.schedule),
                                }}
                                title={`${row.task.name} · ${formatMinute(row.task.schedule.startMinute)}–${formatMinute(row.task.schedule.endMinute)}`}
                              >
                                <span className={styles.taskBarLabel}>
                                  {row.task.name}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <CurrentTimeIndicator />
                    </div>
                  </section>
                </div>
              </Scrollable.Viewport>
              <Scrollable.Scrollbar />
            </Scrollable.Root>
          </div>
        </div>
      </ViewBody>
      {editor?.kind === 'create-project' ? (
        <ProjectsTasksEditorModal
          key="create-project"
          kind="project"
          title={t['com.affine.projects-tasks.new-project']()}
          submitLabel={t['Create']()}
          onOpenChange={open => !open && setEditor(null)}
          onSubmit={name => {
            const projectId = projectsTasksService.createProject(name);
            setExpanded(previous => new Set(previous).add(projectId));
          }}
        />
      ) : null}
      {editor?.kind === 'rename-project' ? (
        <ProjectsTasksEditorModal
          key={`rename-${editor.project.id}`}
          kind="project"
          title={t['com.affine.projects-tasks.rename-project']()}
          submitLabel={t['Save']()}
          initialName={editor.project.name}
          onOpenChange={open => !open && setEditor(null)}
          onSubmit={name =>
            projectsTasksService.renameProject(editor.project.id, name)
          }
        />
      ) : null}
      {editor?.kind === 'create-task' ? (
        <ProjectsTasksEditorModal
          key={`create-task-${editor.project.id}`}
          kind="task"
          title={t['com.affine.projects-tasks.add-task']()}
          submitLabel={t['Create']()}
          onOpenChange={open => !open && setEditor(null)}
          onSubmit={(name, schedule) => {
            if (schedule) {
              projectsTasksService.createTask(
                editor.project.id,
                name,
                schedule
              );
            }
          }}
        />
      ) : null}
      {editor?.kind === 'edit-task' ? (
        <ProjectsTasksEditorModal
          key={`edit-task-${editor.task.id}`}
          kind="task"
          title={t['com.affine.projects-tasks.edit-task']()}
          submitLabel={t['Save']()}
          initialName={editor.task.name}
          initialSchedule={editor.task.schedule}
          onOpenChange={open => !open && setEditor(null)}
          onSubmit={(name, schedule) => {
            if (schedule) {
              projectsTasksService.updateTask(
                editor.projectId,
                editor.task.id,
                name,
                schedule
              );
            }
          }}
        />
      ) : null}
    </>
  );
};
