import { formatEther, formatUnits } from 'ethers/lib/utils';
import { Currency } from '../currency';


export const fixedNumber = (num: number | string, precision = 4): string => {
    return Number(num).toFixed(precision);
};

export const formatCurrency = (num: number | string, currency: Currency = Currency.ETH, precision = 4): string => {

    let formatted = '';
    switch (currency) {
        case Currency.ETH:
            formatted = formatEther(num);
            break;
        default:
            formatted = formatUnits(num, 18);
    }
    return fixedNumber(formatted, precision);
};

