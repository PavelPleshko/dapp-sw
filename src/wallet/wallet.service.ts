import { filter, finalize, from, map, Observable, shareReplay, switchMap, take, withLatestFrom } from 'rxjs';
import { inject, singleton } from 'tsyringe';
import { Currency } from '../shared/currency';
import { StateManager } from '../shared/state-management/state-manager';
import { Erc20Api } from '../tokens/erc20.api';
import { Web3Service } from '../web3';


export interface Balance {
    currency: Currency;
    amount: string;
}

export interface WalletState {
    isConnecting: boolean;
    wallet: string | null;
    balances: Balance[];
}

@singleton()
export class WalletService {

    private _stateManager$ = new StateManager<WalletState>({
        isConnecting: false,
        wallet: null,
        balances: [],
    });

    private _currentAccount$ = this._web3.getAccountChanges().pipe(
        shareReplay(1),
    );

    walletState$ = this._stateManager$.state$;

    isConnecting$ = this.walletState$.pipe(
        map(({ isConnecting }) => isConnecting),
    );

    isWalletConnected$ = this.walletState$.pipe(
        map(({ wallet }) => !!wallet),
    );

    accountBalances$ = this._web3.blockMined$.pipe(
        withLatestFrom(this._currentAccount$),
    ).pipe(
        map(([ , currentAccount ]: [ unknown, string | null ]) => currentAccount),
        filter(Boolean),
        switchMap(currentAccount => Promise.all([
            this._daiApi.getBalance(currentAccount).then(res => ({ currency: Currency.DAI, amount: res.toString() })),
            this._web3.provider.getBalance(currentAccount).then(res => ({ currency: Currency.ETH, amount: res.toString() })),
        ])),
        shareReplay(1),
    );

    balance$ = this._web3.blockMined$.pipe(
        withLatestFrom(this._currentAccount$.pipe(
            filter(Boolean),
        )),
        switchMap(([ , currentAccount ]: [ unknown, string ]) => this._web3.provider.getBalance(currentAccount)),
        shareReplay(1),
    );

    constructor (
        private _web3: Web3Service,
        @inject(Currency.DAI) private _daiApi: Erc20Api,
    ) {
        this._currentAccount$
            .subscribe(wallet => this._stateManager$.pushChange({ wallet }));

        this.accountBalances$.subscribe(balances => this._stateManager$.pushChange({
            balances,
        }));
    }

    connectWallet (): Observable<string | null> {
        this._stateManager$.pushChange({ isConnecting: true });
        return from(this._web3.connect()).pipe(
            switchMap(() => this._currentAccount$),
            take(1),
            finalize(() => this._stateManager$.pushChange({ isConnecting: false })),
        );
    }

    disconnectWallet (): void {
        this._web3.disconnect();
    }

    toggleConnection (): void {
        if (this._stateManager$.rawState.wallet) {
            this.disconnectWallet();
        } else {
            this.connectWallet().subscribe();
        }
    }
}
