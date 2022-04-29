import { map } from 'rxjs';
import { singleton } from 'tsyringe';
import { StateManager } from '../shared/state-management/state-manager';

export interface WalletState {
    isConnecting: boolean;
    wallet: Record<string, string> | null;
}

@singleton()
export class WalletService {

    private _stateManager$ = new StateManager<WalletState>({
        isConnecting: false,
        wallet: null,
    });

    walletState$ = this._stateManager$.state$;

    isConnecting$ = this.walletState$.pipe(
        map(({ isConnecting }) => isConnecting),
    );

    isWalletConnected$ = this.walletState$.pipe(
        map(({ wallet }) => !!wallet),
    );

    connectWallet (): void {
        this._stateManager$.pushChange({ isConnecting: true });
        setTimeout(() => {
            this._stateManager$.pushChange({
                wallet: {},
                isConnecting: false,
            });
        }, 2000);
    }
}
