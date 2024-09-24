export interface ParsedOptions {
	key: string;
	value: string
}

export interface GanttOptions {
	width?: number;
	periodFrom?: number;
	periodTo?: number;
	periods?: any[];
	[k: string]: any;
}

export interface MyPluginSettings {
	mySetting: string;
}
