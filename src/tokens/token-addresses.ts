import { Currency } from '../shared/currency';

export const TOKENS_BY_NETWORK = {
    rinkeby: {
        [Currency.DAI]: '0xEBa449b9150F34396D529643263A90D495Ae563c',
        [Currency.ETH]: '',
    },
} as Record<string, Record<Currency, string>>;
