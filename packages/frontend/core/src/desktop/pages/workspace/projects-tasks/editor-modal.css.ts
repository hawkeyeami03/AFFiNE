import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

export const field = style({
  display: 'flex',
  minWidth: 0,
  flex: 1,
  flexDirection: 'column',
  gap: 8,
});

export const label = style({
  color: cssVar('textSecondaryColor'),
  fontSize: cssVar('fontSm'),
  fontWeight: 500,
});

export const timeFields = style({
  display: 'flex',
  gap: 12,
});

export const error = style({
  color: cssVar('errorColor'),
  fontSize: cssVar('fontXs'),
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
  marginTop: 24,
});
