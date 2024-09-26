import {GanttOptions} from 'src/interfaces';

export const getContainerVirtualWidth = (opts: GanttOptions): number => {
    const start = Number(opts.start);
    const end = Number(opts.end);

    if (start < 0 && end <= 0) {
        return start - end;
    }

    if (start >= 0 && end > 0) {
        return end - start;
    }

    if (start < 0 && end > 0) {
        return Math.abs(start) + end;
    }

    return 0;
};

export const getContainerCells = (opts: GanttOptions, cellSize: number): any[] => {
    const start = Number(opts.start);
    const end = Number(opts.end);
    const cells = [];

    for (let i = start; i < end; i += cellSize) {
        const cellEnd = Math.min(i + cellSize, end);
        cells.push({start: i, end: cellEnd});
    }

    return cells;
};

export const getItemPercentWidth = (start: string, end: string, virtualWidth: number): number => {
    return (Math.abs(Number(start) - Number(end)) / Math.abs(Number(virtualWidth))) * 100;
};

export const getItemPercentMargin = (opts: GanttOptions, start: string): number => {
    let size = 0;
    let idx = 0;

    for (let i = Number(opts.start); i < Number(opts.end); i++) {
        size++;

        if (i === Number(start)) {
            idx = size;
        }
    }

    return (idx / size) * 100;
};

