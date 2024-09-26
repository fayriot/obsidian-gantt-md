export interface ParsedOptions {
    key: string;
    value: string;
}

export interface GanttOptions {
    type?: 'dates' | 'years';
    path: string;
    width?: number;
    start?: number;
    end?: number;
    tick?: number;
    periods?: GanttOptionsPeriod[][];
    [k: string]: any;
}

export interface GanttOptionsPeriod {
    title: string;
    start: string;
    end: string;
    color: string;
}

export interface GanttFileMeta {
    name: string;
    path: string;
    displayDate: GanttPeriod;
    year: GanttPeriod;
    color?: string;
    colorText?: string;
}

export interface GanttPeriod {
    start: string;
    end?: string;
}

export interface GanttPluginSettings {
    setting: string;
}

