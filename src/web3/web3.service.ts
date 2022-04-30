import { ethers } from 'ethers';
import { from, map, merge, Observable } from 'rxjs';
import { singleton, inject } from 'tsyringe';
import { observify } from '../shared/async/observify';
import { ETHEREUM_TOKEN } from './ethereum';

@singleton()
export class Web3Service {

    provider = new ethers.providers.Web3Provider(this._ethereum);

    constructor (
        @inject(ETHEREUM_TOKEN) private _ethereum: Window['ethereum'],
    ) {
    }

    async connect (): Promise<void> {
        await this.provider.send('eth_requestAccounts', []);
    }

    async disconnect (): Promise<void> {
        //
    }


    getSigner (): ethers.providers.JsonRpcSigner {
        return this.provider.getSigner();
    }

    getAccountChanges (): Observable<string> {
        const ethereum = this.provider.provider as ethers.providers.Provider;

        const accountChangedStream$ = observify<string[]>(
            cb => ethereum.on('accountsChanged', cb),
            () => ethereum.off('accountsChanged'),
        );

        return merge(
            accountChangedStream$,
            from(this.provider.listAccounts()),
        ).pipe(
            map(([account]) => account),
        );
    }
}
