import { ethers, utils } from 'ethers';
import { from, map, merge, Observable, of, share, switchMap } from 'rxjs';
import { singleton, inject } from 'tsyringe';
import { observify } from '../shared/async/observify';
import { StorageService } from '../storage/storage.service';
import { ETHEREUM_TOKEN } from './ethereum';


const CONNECTED_ACCOUNT_KEY = 'CONNECTED_ACCOUNT_KEY';

@singleton()
export class Web3Service {

    provider = new ethers.providers.Web3Provider(this._ethereum);

    blockMined$ = observify(
        cb => this.provider.on('block', cb),
        () => this.provider.off('block'),
    ).pipe(
        share(),
    );

    constructor (
        @inject(ETHEREUM_TOKEN) private _ethereum: Window['ethereum'],
        private _storage: StorageService,
    ) {
    }

    async connect (): Promise<void> {
        const result = (await this.provider.send('eth_requestAccounts', []) as string[]);
        if (result) {
            this._storage.setItem(CONNECTED_ACCOUNT_KEY, result[0]);
        }
    }

    disconnect (): void {
        this._storage.removeItem(CONNECTED_ACCOUNT_KEY);
    }

    getSigner (): ethers.Signer {
        const connected = this._storage.getItem(CONNECTED_ACCOUNT_KEY);
        return this.provider.getSigner(connected as string);
    }

    getAccountChanges (): Observable<string | null> {
        const ethereum = this.provider.provider as ethers.providers.Provider;

        const accountChangedStream$ = observify<string[]>(
            cb => ethereum.on('accountsChanged', cb),
            () => ethereum.off('accountsChanged'),
        );

        return merge(
            accountChangedStream$.pipe(
                map(([account]) => account),
            ),
            this._storage.getItemChanges(CONNECTED_ACCOUNT_KEY).pipe(
                switchMap(savedAddress => savedAddress
                    ? from(this.provider.listAccounts())
                        .pipe(
                            map(accounts => {
                                const current = accounts.find(account => account === utils.getAddress(savedAddress));
                                return current || null;
                            }),
                        )
                    : of(null)),
            ),
        );
    }
}
