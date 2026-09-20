import { Header } from '@affine/core/components/pure/header';
import {
  ViewBody,
  ViewHeader,
  ViewIcon,
  ViewTitle,
} from '@affine/core/modules/workbench';
import { useI18n } from '@affine/i18n';

import * as styles from './index.css';

export const Component = () => {
  const t = useI18n();
  const title = t['com.affine.workspaceSubPath.projects-tasks']();

  return (
    <>
      <ViewTitle title={title} />
      <ViewIcon icon="collection" />
      <ViewHeader>
        <Header left={<h1 className={styles.heading}>{title}</h1>} />
      </ViewHeader>
      <ViewBody>
        <div className={styles.body}>
          <section className={styles.projects}>
            <h2 className={styles.heading}>
              {t['com.affine.projects-tasks.projects']()}
            </h2>
          </section>
          <section className={styles.pane}>
            <h2 className={styles.heading}>
              {t['com.affine.projects-tasks.timeline']()}
            </h2>
          </section>
        </div>
      </ViewBody>
    </>
  );
};
