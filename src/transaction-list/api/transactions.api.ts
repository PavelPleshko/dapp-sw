import { singleton } from 'tsyringe';
import { EtherScanClient } from '../../etherscan';


@singleton()
export class TransactionsApi {

    constructor (
        private _etherScanClient: EtherScanClient,
    ) {}

    getTransactionsForAddress (address: string): Promise<any[]> {

        const query = {
            action: 'txlist',
            address,
            page: 1,
            offset: 0,
            sort: 'asc',
        };

        return this._etherScanClient.get<any[]>(query);
    }
}
