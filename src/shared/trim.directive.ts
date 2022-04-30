const TRIMMED_PLACEHOLDER = '...';

export const trimBetween = (val: string, charsVisible = 4): string => {
    const totalVisible = charsVisible * 2;
    if (totalVisible >= val.length) {
        return val;
    }
    return `${ val.slice(0, charsVisible) }${ TRIMMED_PLACEHOLDER }${ val.slice(val.length - charsVisible) }`;
};


export const trimAddress = (val: string, charsVisible = 4): string => {
    const ignoredChars = /^0x/;
    return '0x' + trimBetween(val.replace(ignoredChars, ''), charsVisible);
};
