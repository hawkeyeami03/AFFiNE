import { IconButton, Scrollable } from '@affine/component';
import { Header } from '@affine/core/components/pure/header';
import {
  ViewBody,
  ViewHeader,
  ViewIcon,
  ViewTitle,
} from '@affine/core/modules/workbench';
import { useI18n } from '@affine/i18n';
import {
  ArrowDownSmallIcon,
  PageIcon,
  ViewLayersIcon,
} from '@blocksuite/icons/rc';
import { useEffect, useRef, useState } from 'react';

import * as styles from './index.css';
import { formatMinute, getVisibleRows, HOURS, minuteToX } from './model';

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
  const title = t['com.affine.workspaceSubPath.projects-tasks']();
  const [expanded, setExpanded] = useState(() => new Set(['beta']));
  const rows = getVisibleRows(expanded);

  const toggleProject = (id: string) => {
    setExpanded(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <ViewTitle title={title} />
      <ViewIcon icon="collection" />
      <ViewHeader>
        <Header left={<h1 className={styles.heading}>{title}</h1>} />
      </ViewHeader>
      <ViewBody>
        <div className={styles.body}>
          <Scrollable.Root>
            <Scrollable.Viewport>
              <div className={styles.scheduler}>
                <section
                  className={styles.projects}
                  aria-label={t['com.affine.projects-tasks.projects']()}
                >
                  <h2 className={styles.treeHeader}>{title}</h2>
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
                            aria-label={row.name}
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
                      <span className={styles.rowName} title={row.name}>
                        {row.name}
                      </span>
                    </div>
                  ))}
                </section>
                <section
                  className={styles.timeline}
                  aria-label={t['com.affine.projects-tasks.timeline']()}
                  tabIndex={0}
                >
                  <div className={styles.timelineContent}>
                    <div className={styles.timeHeader}>
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
                    <div className={styles.grid}>
                      {rows.map(row => (
                        <div key={row.id} className={styles.timelineRow}>
                          {row.type === 'task' && (
                            <div
                              className={styles.taskBar}
                              style={{
                                left: minuteToX(row.startMinute),
                                width: minuteToX(
                                  row.endMinute - row.startMinute
                                ),
                              }}
                              title={`${row.name} · ${formatMinute(row.startMinute)}–${formatMinute(row.endMinute)}`}
                            >
                              {row.name}
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
      </ViewBody>
    </>
  );
};
