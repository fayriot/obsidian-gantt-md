import {App, FrontMatterCache, Notice, TFile} from 'obsidian';
import {GanttFileMeta, GanttOptions, GanttPeriod} from 'src/interfaces';

export const getFilesCollection = (app: App, path: string): GanttFileMeta[] => {
    const files = app.vault.getMarkdownFiles();
    const sortedFiles = files.filter(file => filesFilter(file, path));
    const result: any = [];

    sortedFiles.forEach(file => {
        const metadata = app.metadataCache.getFileCache(file);
        result.push({
            name: file.basename,
            path: file.path,
            date: convertDate(metadata?.frontmatter),
            color: metadata?.frontmatter?.color,
            colorText: metadata?.frontmatter?.colorText ?? 'var(--inline-title-color)', // todo fix
            displayDate: prepareDisplayDate(metadata?.frontmatter),
            displayName: metadata?.frontmatter?.dateString,
            displayDuration: metadata?.frontmatter?.dateStringDuration,

            type: metadata?.frontmatter?.type,
        });
    });

    return result;
};

export const filterDates = (link: GanttFileMeta, opts: GanttOptions): boolean => {
    if (!link.date) {
        return false;
    }

    if (Number(link.date.start) > Number(opts.end) || Number(link.date.start) < Number(opts.start) || Number(link.date.end) < Number(opts.start)) {
        return false;
    }

    return true;
};

const filesFilter = (file: TFile, path: string): boolean => {
    return file.parent?.path === path;
};

const convertDate = (f?: FrontMatterCache): GanttPeriod | null => {
    if (!f) {
        return null;
    }

    const start = prepareDateString(f.date.dateY, f.date.dateM, f.date.dateD);
    const end = prepareDateString(f.date.dateY_end, f.date.dateM_end, f.date.dateD_end);

    if (!start || !end) {
        return null;
    }

    return {
        start,
        end,
    };
};

const prepareDateString = (y?: number, m?: number, d?: number): string | null => {
    let i = 0;
    let result = '';

    try {
        for (const arg of [y, m, d]) {
            if (typeof arg === 'number') {
                if (i !== 0 && arg.toString().length > 2) {
                    console.warn('Wrong MM or DD format');
                    throw new Error('Wrong MM or DD format'); //todo cleanup
                }

                if (arg.toString().length === 1) {
                    result += '0' + arg;
                } else {
                    result += arg;
                }
            } else {
                result += '';
            }

            i++;
        }

        return result;
    } catch (e) {
        new Notice('Wrong MM or DD format');
        return null;
    }
};

const prepareDisplayDate = (f?: FrontMatterCache): GanttPeriod | null => {
    if (!f) {
        return null;
    }

    const start = `${formatYMD(f.date.dateY)}${formatYMD(f.date?.dateM, '-', true)}${formatYMD(f.date?.dateD, '-', true)}`;
    const end = `${formatYMD(f.date.dateY_end)}${formatYMD(f.date?.dateM_end, '-', true)}${formatYMD(f.date?.dateD_end, '-', true)}`;

    return {
        start,
        end,
    };
};

const formatYMD = (v: any, prefix = '', addZero?: boolean): string => {
    if (typeof v === 'number') {
        if (addZero) {
            if (v.toString().length === 1) {
                return prefix + '0' + v;
            }
        }

        return prefix + v.toString();
    } else {
        return '';
    }
};

