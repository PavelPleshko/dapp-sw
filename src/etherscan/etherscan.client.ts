import { singleton } from 'tsyringe';
import { PrimitiveParams, serializeQuery } from '../shared/http/query-params';

export interface EtherScanResponse<T> {
    result: T;
}

@singleton()
export class EtherScanClient {

    // TODO set it based on current network via DI
    apiUrl = 'https://api-rinkeby.etherscan.io/api';

    // FIXME unsafe
    apiKey = 'I2J77SXEGHR5YYBESFB5ZESSDSRNAUBWXB';


    get<T> (query: Record<string, PrimitiveParams> = {}): Promise<T> {
        const updatedQuery = {
            ...query,
            startblock: 0,
            endblock: 99999999,
            module: 'account',
            apiKey: this.apiKey,
        };

        const url = `${ this.apiUrl }?${ serializeQuery(updatedQuery) }`;

        return fetch(url)
            .then(res => res.json() as Promise<EtherScanResponse<T>>)
            .then(({ result }) => result);
    }
}
