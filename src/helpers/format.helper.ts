export const formatBC = (value: number | string, onlyNumber?: boolean): string => {
    if (onlyNumber) {
        return Math.abs(Number(value)).toString();
    }
    return Number(value) < 0 ? Math.abs(Number(value)) + ' до н.э.' : Math.abs(Number(value)) + ' н.э.';
};

