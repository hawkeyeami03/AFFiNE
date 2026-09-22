import { Button, Input, Modal } from '@affine/component';
import type { TaskSchedule } from '@affine/core/modules/projects-tasks';
import { useI18n } from '@affine/i18n';
import { useCallback, useMemo, useState } from 'react';

import * as styles from './editor-modal.css';
import { formatMinute } from './model';

type ProjectsTasksEditorModalProps = {
  kind: 'project' | 'task';
  title: string;
  submitLabel: string;
  initialName?: string;
  initialSchedule?: TaskSchedule;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, schedule?: TaskSchedule) => void;
};

const DEFAULT_TASK_SCHEDULE = {
  startMinute: 9 * 60,
  endMinute: 10 * 60,
} as const;

function parseTime(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

export const ProjectsTasksEditorModal = ({
  kind,
  title,
  submitLabel,
  initialName = '',
  initialSchedule = DEFAULT_TASK_SCHEDULE,
  onOpenChange,
  onSubmit,
}: ProjectsTasksEditorModalProps) => {
  const t = useI18n();
  const [name, setName] = useState(initialName);
  const [start, setStart] = useState(formatMinute(initialSchedule.startMinute));
  const [end, setEnd] = useState(formatMinute(initialSchedule.endMinute));
  const schedule = useMemo(
    () => ({ startMinute: parseTime(start), endMinute: parseTime(end) }),
    [end, start]
  );
  const scheduleValid =
    kind === 'project' ||
    (Number.isFinite(schedule.startMinute) &&
      Number.isFinite(schedule.endMinute) &&
      schedule.startMinute < schedule.endMinute);
  const canSubmit = name.trim().length > 0 && scheduleValid;

  const submit = useCallback(() => {
    if (!canSubmit) return;
    onSubmit(name, kind === 'task' ? schedule : undefined);
    onOpenChange(false);
  }, [canSubmit, kind, name, onOpenChange, onSubmit, schedule]);

  return (
    <Modal open title={title} width={480} onOpenChange={onOpenChange}>
      <div className={styles.content}>
        <label className={styles.field}>
          <span className={styles.label}>
            {kind === 'project'
              ? t['com.affine.projects-tasks.project-name']()
              : t['com.affine.projects-tasks.task-name']()}
          </span>
          <Input autoFocus value={name} onChange={setName} onEnter={submit} />
        </label>
        {kind === 'task' ? (
          <>
            <div className={styles.timeFields}>
              <label className={styles.field}>
                <span className={styles.label}>
                  {t['com.affine.projects-tasks.start-time']()}
                </span>
                <Input
                  type="time"
                  step={900}
                  value={start}
                  onChange={setStart}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>
                  {t['com.affine.projects-tasks.end-time']()}
                </span>
                <Input type="time" step={900} value={end} onChange={setEnd} />
              </label>
            </div>
            {!scheduleValid ? (
              <div className={styles.error} role="alert">
                {t['com.affine.projects-tasks.invalid-time']()}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      <div className={styles.footer}>
        <Button size="large" onClick={() => onOpenChange(false)}>
          {t['Cancel']()}
        </Button>
        <Button
          size="large"
          variant="primary"
          disabled={!canSubmit}
          onClick={submit}
        >
          {submitLabel}
        </Button>
      </div>
    </Modal>
  );
};
