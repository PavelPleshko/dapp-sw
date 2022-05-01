import { finalize, from, map, Observable, shareReplay, switchMap, take } from 'rxjs';
import { singleton } from 'tsyringe';
import { StateManager } from '../shared/state-management/state-manager';
import { Web3Service } from '../web3';

export interface WalletState {
    isConnecting: boolean;
    wallet: string | null;
}

@singleton()
export class WalletService {

    private _stateManager$ = new StateManager<WalletState>({
        isConnecting: false,
        wallet: null,
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

    constructor (
        private _web3: Web3Service,
    ) {
        this._currentAccount$
            .subscribe(wallet => this._stateManager$.pushChange({ wallet }));
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
