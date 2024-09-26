export const formatDate = (value?: number | string, onlyNumber?: boolean, type?: string, ticks?: boolean): string => {
    if (!value && typeof value !== 'number') {
        return '';
    }

    if (type === 'dates') {
        if (ticks) {
            return value.toString().slice(0, -4);
        }
        return value.toString();
    }

    if (onlyNumber) {
        return Math.abs(Number(value)).toString();
    }
    return Number(value) < 0 ? Math.abs(Number(value)) + ' до н.э.' : Math.abs(Number(value)) + ' н.э.';
};

