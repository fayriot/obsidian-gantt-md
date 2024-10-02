export const DEFAULT_EDITOR_BLOCK_YEARS =
    '```' +
    `
gantt-md

path: path/to/files

width: 2000
start: -8000
end: 0
tick: 500
` +
    '```';

export const DEFAULT_EDITOR_BLOCK_DATES =
    '```' +
    `
gantt-md

type: dates
path: path/to/files

width: 1000
start: 500-01-01
end: 1200-01-01
tick: 100
` +
    '```';

export const DEFAULT_NOTE_EXAMPLE = `---
date:
  dateY: 2000
  dateY_end: 2001
  dateM: 01
  dateM_end: 01
  dateD: 01
  dateD_end: 25
type: event

dateString: event name
dateStringDuration: 2000-01-01 - 2001-01-25

color: #76923c
colorText: #fff
---

This is example note with gantt chart. 

\`\`\`
type: 'period' | 'subperiod' | 'event',
\`\`\`
`;

