export interface ParsedOptions {
    key: string;
    value: string;
}

export interface GanttOptions {
    width?: number;
    periodFrom?: number;
    periodTo?: number;
    periods?: GanttOptionsPeriod[][];
    [k: string]: any;
}

export interface GanttOptionsPeriod {
    title: string;
    start: string;
    end: string;
}

export interface GanttFileMeta {
    name: string;
    path: string;
    date: GanttPeriod;
    year: GanttPeriod;
    color?: string;
}

export interface GanttPeriod {
    start: string;
    end?: string;
}

export interface MyPluginSettings {
    mySetting: string;
}

