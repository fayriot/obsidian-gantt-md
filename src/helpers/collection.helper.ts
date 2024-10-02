import {GanttFileMeta, GanttOptions} from 'src/interfaces';

export const getGroupedItems = (links: GanttFileMeta[], opts: GanttOptions): any[] => {
    const end = Number(opts.end);
    const result: any[] = [];
    const preparedArr = [...links];

    preparedArr.sort((a, b) => Number(a.date?.start) - Number(b.date?.start));
    groupItems(preparedArr, end, result);

    return result;
};

const groupItems = (preparedArr: GanttFileMeta[], end: number, result: any): void => {
    const startLength = preparedArr.length;

    console.log(preparedArr);

    group(preparedArr, end, result, startLength);
};

const group = (preparedArr: GanttFileMeta[], end: number, result: any, startLength: number): void => {
    const removeIdxs: any = [];
    const a: any[] = [];

    preparedArr.forEach((link: GanttFileMeta, index) => {
        if (!a.length) {
            a.push(link);
            removeIdxs.push(index);
        }

        const found = a.filter((e: any) => Number(e.date.end) > Number(link.date.start));

        if (!found.length) {
            a.push(link);
            removeIdxs.push(index);
        }
    });

    result.push(a);

    preparedArr = preparedArr.filter(function (value, index) {
        return removeIdxs.indexOf(index) == -1;
    });

    if (preparedArr.length === 1) {
        result.push([preparedArr[0]]);
        preparedArr.splice(0, 1);
    }

    if (startLength === preparedArr.length) {
        return;
    }

    if (preparedArr.length || preparedArr.length >= 1) {
        group(preparedArr, end, result, startLength);
    }
};

