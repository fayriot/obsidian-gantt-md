import {App} from 'obsidian';
import {GanttFileMeta, GanttOptions} from 'src/interfaces';

export const getFilesCollection = (app: App, path: string): GanttFileMeta[] => {
    const files = app.vault.getMarkdownFiles();
    const sortedFiles = files.filter(file => file.parent?.path === path);
    const result: any = [];

    sortedFiles.forEach(file => {
        // console.log(file);
        // const content = this.app.vault.cachedRead(file);
        const metadata = app.metadataCache.getFileCache(file);
        // console.log(metadata);
        result.push({
            name: file.basename,
            path: file.path,
            displayDate: {
                start: metadata?.frontmatter?.yearStart ?? metadata?.frontmatter?.dateStart,
                end: metadata?.frontmatter?.yearEnd ?? metadata?.frontmatter?.dateEnd,
            },
            year: {
                start: metadata?.frontmatter?.yearStart ?? metadata?.frontmatter?.dateStart.split('-').join(''),
                end: metadata?.frontmatter?.yearEnd ?? metadata?.frontmatter?.dateEnd.split('-').join(''),
            },
            color: metadata?.frontmatter?.color,
            colorText: metadata?.frontmatter?.colorText ?? 'var(--inline-title-color)',
        });
    });
    // console.log(result);
    return result;
};

export const filterDates = (link: GanttFileMeta, opts: GanttOptions): boolean => {
    if (Number(link.year.start) > Number(opts.end) || Number(link.year.start) < Number(opts.start) || Number(link.year.end) < Number(opts.start)) {
        return false;
    }

    return true;
};

