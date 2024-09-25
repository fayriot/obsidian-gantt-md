import {App} from 'obsidian';
import {GanttFileMeta} from 'src/interfaces';

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
            date: {
                start: metadata?.frontmatter?.dateFrom,
                end: metadata?.frontmatter?.dateTo,
            },
            year: {
                start: metadata?.frontmatter?.relDateFrom,
                end: metadata?.frontmatter?.relDateTo,
            },
            color: metadata?.frontmatter?.color,
        });
    });
    // console.log(result);
    return result;
};

