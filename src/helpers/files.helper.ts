import {App, FrontMatterCache, TFile} from 'obsidian';
import {GanttFileMeta, GanttOptions, GanttPeriod} from 'src/interfaces';

export const getFilesCollection = (app: App, path: string): GanttFileMeta[] => {
    const files = app.vault.getMarkdownFiles();
    const sortedFiles = files.filter(file => filesFilter(file, path));
    const result: any = [];

    sortedFiles.forEach(file => {
        // console.log(file);
        // const content = this.app.vault.cachedRead(file);
        const metadata = app.metadataCache.getFileCache(file);
        console.log(metadata);
        // console.log(metadata);
        result.push({
            name: file.basename,
            path: file.path,
            // year: {
            //     start: metadata?.frontmatter?.yearStart ?? metadata?.frontmatter?.dateStart.split('-').join(''),
            //     end: metadata?.frontmatter?.yearEnd ?? metadata?.frontmatter?.dateEnd.split('-').join(''),
            // },
            date: convertDate(metadata?.frontmatter),
            color: metadata?.frontmatter?.color,
            colorText: metadata?.frontmatter?.colorText ?? 'var(--inline-title-color)',
            displayDate: prepareDisplayDate(metadata?.frontmatter),
            displayName: metadata?.frontmatter?.dateString,
            displayDuration: metadata?.frontmatter?.dateStringDuration,

            type: metadata?.frontmatter?.type,
        });
    });
    console.log(result);
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
                    throw new Error('Wrong MM or DD format'); //todo pass error
                }
                result += arg;
            } else {
                result += ''; //todo optimize
            }

            i++;
        }

        return result;
    } catch (e) {
        return null;
    }
};

const prepareDisplayDate = (f?: FrontMatterCache): GanttPeriod | null => {
    if (!f) {
        return null;
    }

    const start = `${f.date?.dateY ? f.date.dateY : ''}${f.date?.dateM ? '-' + f.date.dateM : ''}${f.date?.dateD ? '-' + f.date.dateD : ''}`;
    const end = `${f.date?.dateY_end ? f.date.dateY_end : ''}${f.date?.dateM_end ? '-' + f.date.dateM_end : ''}${f.date?.dateD_end ? '-' + f.date.dateD_end : ''}`;

    return {
        start,
        end,
    };
};

