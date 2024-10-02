export interface ParsedOptions {
    key: string;
    value: string;
}

export interface GanttOptions {
    type?: GanttOptionsTypeEnum;
    path: string;
    width?: number;
    start?: number;
    end?: number;
    tick?: number;
    [k: string]: any;
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
    type: InputFileMetaTypeEnum;
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
    maxTicks: string;
}

export interface InputFileMeta {
    date?: InputFileMetaDate;
    dateString?: string;
    dateDuration?: number;
    dateStringDuration?: string;
    type?: InputFileMetaTypeEnum;
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

export enum InputFileMetaTypeEnum {
    PERIOD = 'period',
    SUBPERIOD = 'subperiod',
    EVENT = 'event',
}

export enum GanttOptionsTypeEnum {
    DATES = 'dates',
    YEARS = 'years',
}

