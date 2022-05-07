import { filter, map, switchMap, take } from 'rxjs';
import { injectable } from 'tsyringe';
import { StateManager } from '../../shared/state-management/state-manager';
import { WalletService } from '../../wallet';
import { Transaction, TransactionsApi } from '../api/transactions.api';


interface TransactionListState {
    isLoading: boolean;
    items: Transaction[];
}

@injectable()
export class TransactionListService {

    private _txListStateManager$ = new StateManager<TransactionListState>({
        isLoading: true,
        items: [],
    });

    txListState$ = this._txListStateManager$.state$;

    constructor (
        private _walletService: WalletService,
        private _transactionsApi: TransactionsApi,
    ) {
    }

    loadTransactions (): void {
        this._txListStateManager$.pushChange({ isLoading: true });
        this._walletService.walletState$.pipe(
            map(state => state.wallet),
            filter(Boolean),
            take(1),
            switchMap(wallet => this._transactionsApi.getTransactionsForAddress(wallet)),
        ).subscribe(items => {
            this._txListStateManager$.pushChange({ isLoading: false, items });
        });
    }

}
