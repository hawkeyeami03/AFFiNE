import { cssVar } from '@toeverything/theme';
import { style } from '@vanilla-extract/css';

import {
  DAY_WIDTH,
  HEADER_HEIGHT,
  HOUR_WIDTH,
  ROW_HEIGHT,
  TIMELINE_WIDTH,
} from './model';

export const body = style({
  width: '100%',
  height: '100%',
  minWidth: 0,
  minHeight: 0,
  background: cssVar('backgroundPrimaryColor'),
  color: cssVar('textPrimaryColor'),
});

export const scheduler = style({
  display: 'grid',
  gridTemplateColumns: 'min(280px, 45%) minmax(0, 1fr)',
  alignItems: 'start',
  minHeight: '100%',
});

export const heading = style({
  margin: 0,
  fontSize: cssVar('fontSm'),
  fontWeight: 600,
});

export const projects = style({
  minWidth: 0,
  borderRight: `1px solid ${cssVar('borderColor')}`,
});

const row = style({
  boxSizing: 'border-box',
  height: ROW_HEIGHT,
  borderBottom: `1px solid ${cssVar('borderColor')}`,
});

export const treeHeader = style([
  heading,
  {
    boxSizing: 'border-box',
    height: HEADER_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderBottom: `1px solid ${cssVar('borderColor')}`,
    color: cssVar('textSecondaryColor'),
    fontSize: cssVar('fontXs'),
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
]);

export const treeRow = style([
  row,
  {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 12px',
    fontSize: cssVar('fontSm'),
    ':hover': { background: cssVar('hoverColor') },
    selectors: {
      '&[data-row-type="project"]': { fontWeight: 500 },
      '&[data-row-type="task"]': { paddingLeft: 48 },
    },
  },
]);

export const rowName = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const rowIcon = style({
  width: 16,
  height: 16,
  flexShrink: 0,
  color: cssVar('iconColor'),
});

export const chevron = style({
  transform: 'rotate(-90deg)',
  selectors: { '&[data-expanded="true"]': { transform: 'rotate(0deg)' } },
});

// The parent Scrollable owns vertical scrolling for BOTH panes. This viewport
// scrolls only the timeline horizontally; no scroll-position synchronization.
export const timeline = style({
  minWidth: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'thin',
  scrollbarColor: `${cssVar('dividerColor')} ${cssVar('backgroundPrimaryColor')}`,
  ':focus-visible': {
    outline: `2px solid ${cssVar('primaryColor')}`,
    outlineOffset: -2,
  },
});

export const timelineContent = style({
  position: 'relative',
  width: TIMELINE_WIDTH,
});

export const timeHeader = style({
  boxSizing: 'border-box',
  position: 'relative',
  height: HEADER_HEIGHT,
  borderBottom: `1px solid ${cssVar('borderColor')}`,
  color: cssVar('textSecondaryColor'),
  fontSize: cssVar('fontXs'),
  fontVariantNumeric: 'tabular-nums',
});

export const hourLabel = style({
  position: 'absolute',
  top: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 8,
  borderLeft: `1px solid ${cssVar('borderColor')}`,
});

export const grid = style({
  backgroundImage: [
    `repeating-linear-gradient(to right, ${cssVar('borderColor')} 0 1px, transparent 1px ${HOUR_WIDTH}px)`,
    `repeating-linear-gradient(to right, color-mix(in srgb, ${cssVar('borderColor')} 45%, transparent) 0 1px, transparent 1px ${HOUR_WIDTH / 4}px)`,
  ].join(', '),
  backgroundSize: `${DAY_WIDTH + 1}px 100%`,
  backgroundRepeat: 'no-repeat',
});

export const timelineRow = style([row, { position: 'relative' }]);

export const taskBar = style({
  position: 'absolute',
  top: 9,
  height: 26,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  padding: '0 10px',
  borderRadius: 4,
  border: `1px solid ${cssVar('primaryColor')}`,
  background: `color-mix(in srgb, ${cssVar('primaryColor')} 18%, ${cssVar('backgroundPrimaryColor')})`,
  color: cssVar('textPrimaryColor'),
  fontSize: cssVar('fontXs'),
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

export const currentTime = style({
  position: 'absolute',
  top: HEADER_HEIGHT - 6,
  bottom: 0,
  width: 1,
  background: cssVar('errorColor'),
  pointerEvents: 'none',
  '::before': {
    content: '""',
    position: 'absolute',
    left: -3,
    top: 0,
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: cssVar('errorColor'),
  },
});
