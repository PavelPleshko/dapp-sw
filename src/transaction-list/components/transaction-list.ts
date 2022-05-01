import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { container, registry } from 'tsyringe';
import { ObserveController } from '../../shared/async/observe.controller';
import { TransactionListService } from './transaction-list.service';

@customElement('app-transaction-list')
@registry([
    {
        token: TransactionListService,
        useClass: TransactionListService,
    },
])
export class TransactionList extends LitElement {

    private _transactionListService = container.resolve(TransactionListService);

    private _transactionStateController = new ObserveController(
        this,
        this._transactionListService.txListState$,
    );

    createRenderRoot (): TransactionList {
        return this;
    }

    render (): ReturnType<typeof html> {
        return html`
            <div class="transaction-list">
            
                <div class="transaction-list__actions p-4">
                    <button class="sw-btn sw-btn--primary">Refresh</button>
                </div>
               
                <hr>
                
                <div class="transaction-list__content p-4">
                    ${ when(
            this._transactionStateController.value.isLoading,
            () => html`Loading transactions...`,
            () => {
                if (!this._transactionStateController.value.items.length) {
                    return html`There are no transactions yet.`;
                }
            },
        ) }
                </div>
            </div>
        `;
    }

    connectedCallback (): void {
        super.connectedCallback();
        this._transactionListService.loadTransactions();
    }
}
