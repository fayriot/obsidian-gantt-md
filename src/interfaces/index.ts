export interface ParsedOptions {
    key: string;
    value: string;
}

export interface GanttOptions {
    /**
     * @deprecated
     */
    type?: 'dates' | 'years';
    path: string;
    width?: number;
    start?: number;
    end?: number;
    tick?: number;
    /**
     * @deprecated
     */
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
    /**
     * File path
     */
    path: string;
    /**
     * File (event) name
     */
    name: string;
    /**
     * Display date (start - end), generated from year.* dates
     */
    displayDate: GanttPeriod;
    /**
     * Virtual date string, generated from year.* dates. Pattern YYYY+MM+DD
     */
    date: GanttPeriod;
    /**
     * Item type
     */
    type: InputFileMetaType;
    /**
     * Item color
     */
    color?: string;
    /**
     * Item text color
     */
    colorText?: string;

    /**
     * Custom event display name
     */
    displayName?: string;
    /**
     * Custom event display duration
     */
    displayDuration?: string;
}

export interface GanttPeriod {
    start?: string;
    end?: string;
}

export interface GanttPluginSettings {
    setting: string;
}

export interface InputFileMeta {
    date?: InputFileMetaDate;
    dateString?: string;
    dateDuration?: number;
    dateStringDuration?: string;
    type?: InputFileMetaType;
    color?: string;
    colorText?: string;
}

export interface InputFileMetaDate {
    dateY?: number;
    dateM?: number;
    dateD?: number;
    dateY_end?: number;
    dateM_end?: number;
    dateD_end?: number;
}

export enum InputFileMetaType {
    PERIOD = 'period',
    SUBPERIOD = 'subperiod',
    EVENT = 'event',
}

