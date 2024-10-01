import {GanttFileMeta, GanttOptions} from 'src/interfaces';

export const getGroupedItems = (links: GanttFileMeta[], opts: GanttOptions): any[] => {
    const end = Number(opts.end);
    const result: any[] = [];
    const preparedArr = [...links];

    // preparedArr.sort((a, b) => (a.date.start! > b.date.start! ? 1 : -1));
    preparedArr.sort((a, b) => Number(a.date?.start) - Number(b.date?.start));
    groupItems(preparedArr, end, result);

    return result;
};

const groupItems = (preparedArr: GanttFileMeta[], end: number, result: any): void => {
    const startLength = preparedArr.length;
    const a: any[] = [];

    console.log(preparedArr);

    group(preparedArr, end, result, a, startLength);

    // preparedArr.forEach((link: GanttFileMeta, index) => {
    //     console.log(a.length);
    //     console.log(link);
    //     if (!a.length) {
    //         a.push(link);
    //         preparedArr.splice(index, 1);
    //         console.log(a);
    //         return;
    //     }

    //     if (preparedArr.length === 1) {
    //         result.push([preparedArr[0]]);
    //         preparedArr.splice(0, 1);
    //         return;
    //     }

    //     const found = a.filter((e: any) => Number(e.date.end) > Number(link.date.start));
    //     console.log(found);

    //     if (!found.length) {
    //         a.push(link);
    //         preparedArr.splice(index, 1);
    //         return;
    //     }
    // });

    // result.push(a);

    // // if (preparedArr.length === 1) {
    // //     result.push([preparedArr[0]]);
    // //     preparedArr.splice(0, 1);
    // // }

    // if (startLength === preparedArr.length) {
    //     return;
    // }

    // if (preparedArr.length || preparedArr.length > 1) {
    //     groupItems(preparedArr, end, result);
    // }
};

const group = (preparedArr: GanttFileMeta[], end: number, result: any, a: any[], startLength: number): void => {
    const removeIdxs: any = [];
    preparedArr.forEach((link: GanttFileMeta, index) => {
        // console.log(a.length);
        // console.log(link);

        if (!a.length) {
            a.push(link);
            // preparedArr.splice(index, 1);
            removeIdxs.push(index);
            // console.log(a);
            // return;
        }

        // if (preparedArr.length === 1) {
        //     result.push([preparedArr[0]]);
        //     preparedArr.splice(0, 1);
        //     return;
        // }

        const found = a.filter((e: any) => Number(e.date.end) > Number(link.date.start));
        // console.log(found);

        if (!found.length) {
            a.push(link);
            // preparedArr.splice(index, 1);
            removeIdxs.push(index);
            // return;
        }
    });

    result.push(a);

    // removeIdxs.forEach(idx => {
    //     preparedArr.splice(idx, 1);
    // });

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
        console.log('recursion');
        group(preparedArr, end, result, a, startLength);
    }
};

