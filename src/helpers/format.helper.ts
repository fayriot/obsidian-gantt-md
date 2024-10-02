import {GanttOptionsTypeEnum} from 'src/interfaces';

export const formatDate = (value?: number | string, onlyNumber?: boolean, type?: string, ticks?: boolean): string => {
    if (!value && typeof value !== 'number') {
        return '';
    }

    if (type === GanttOptionsTypeEnum.DATES) {
        if (ticks) {
            return !value.toString().slice(0, -4) ? '0' : value.toString().slice(0, -4);
        }
        return value.toString();
    }

    if (onlyNumber) {
        return Math.abs(Number(value)).toString();
    }

    return Number(value) < 0 ? Math.abs(Number(value)) + ' л. до н.э.' : Math.abs(Number(value)) + ' л. н.э.';
};

