import { finalize, from, map, Observable, shareReplay, switchMap, take, withLatestFrom } from 'rxjs';
import { singleton } from 'tsyringe';
import { observify } from '../shared/async/observify';
import { StateManager } from '../shared/state-management/state-manager';
import { Web3Service } from '../web3';


export interface Balance {
    currency: string;
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

    balance$ = observify(
        cb => this._web3.provider.on('block', cb),
        () => this._web3.provider.off('block'),
    ).pipe(
        withLatestFrom(this._currentAccount$),
        switchMap(([ , currentAccount ]: [ unknown, string ]) => this._web3.provider.getBalance(currentAccount)),
        shareReplay(1),
    );

    constructor (
        private _web3: Web3Service,
    ) {
        this._currentAccount$
            .subscribe(wallet => this._stateManager$.pushChange({ wallet }));

        this.balance$.subscribe(balance => this._stateManager$.pushChange({
            balances: [
                {
                    currency: 'ETH',
                    amount: balance.toString(),
                },
            ],
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
