import { container } from 'tsyringe';
import { Currency } from '../shared/currency';
import { Erc20Factory } from './erc20.factory';
import { TOKENS_BY_NETWORK } from './token-addresses';

const DEFAULT_NETWORK = 'rinkeby';

export function TOKENS_INIT_FACTORY (): void {
    const tokensOnCurrentNetwork = TOKENS_BY_NETWORK[DEFAULT_NETWORK];
    const factory = container.resolve(Erc20Factory);
    (Object.keys(tokensOnCurrentNetwork) as Currency[]).forEach(token => {
        const address = tokensOnCurrentNetwork[token];
        if (address) {
            factory.create(address, token);
        }
    });
}

