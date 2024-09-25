import {GanttFileMeta, GanttOptions} from 'src/interfaces';

export const getGroupedItems = (links: GanttFileMeta[], opts: GanttOptions): any[] => {
    const end = Number(opts.periodTo);
    const result: any[] = [];
    const preparedArr = [...links];

    preparedArr.sort((a, b) => (a.year.start > b.year.start ? 1 : -1));
    groupItems(preparedArr, end, result);

    return result;
};

const groupItems = (preparedArr: GanttFileMeta[], end: number, result: any): void => {
    const startLength = preparedArr.length;
    const a: any[] = [];
    preparedArr.forEach((link: GanttFileMeta, index) => {
        if (!a.length) {
            a.push(link);
            preparedArr.splice(index, 1);
            return;
        }

        const found = a.filter((e: any) => Number(e.year.end) > Number(link.year.start));

        if (!found.length) {
            a.push(link);
            preparedArr.splice(index, 1);
            return;
        }
    });

    result.push(a);

    if (preparedArr.length === 1) {
        result.push([preparedArr[0]]);
        preparedArr.splice(0, 1);
    }

    if (startLength === preparedArr.length) {
        return;
    }

    if (preparedArr.length || preparedArr.length > 1) {
        groupItems(preparedArr, end, result);
    }
};

