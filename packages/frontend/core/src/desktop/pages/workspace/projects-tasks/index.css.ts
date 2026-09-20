import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';

export const body = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 280px) minmax(0, 1fr)',
  width: '100%',
  height: '100%',
  minWidth: 0,
  minHeight: 0,
  background: cssVar('backgroundPrimaryColor'),
  color: cssVar('textPrimaryColor'),
});

export const pane = style({
  minWidth: 0,
  minHeight: 0,
  padding: '16px',
  overflow: 'auto',
});

export const projects = style([
  pane,
  { borderRight: `1px solid ${cssVar('borderColor')}` },
]);

export const heading = style({
  margin: 0,
  fontSize: cssVar('fontSm'),
  fontWeight: 600,
});
