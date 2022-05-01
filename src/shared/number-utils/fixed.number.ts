

export const fixedNumber = (num: number | string, precision = 4): string => {
    return Number(num).toFixed(precision);
};
