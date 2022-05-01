import { singleton } from 'tsyringe';
import { EtherScanClient } from '../../etherscan';


export interface Transaction {
    blockHash: string;
    blockNumber: string;
    confirmations: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    from: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    hash: string;
    timeStamp: string;
    to: string;
    transactionIndex: string;
    txreceipt_status: string;
    value: string;
}


@singleton()
export class TransactionsApi {

    constructor (
        private _etherScanClient: EtherScanClient,
    ) {}

    getTransactionsForAddress (address: string): Promise<Transaction[]> {

        const query = {
            action: 'txlist',
            address,
            page: 1,
            offset: 0,
            sort: 'asc',
        };

        return this._etherScanClient.get<Transaction[]>(query);
    }
}
