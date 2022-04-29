import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-transaction-list')
export class TransactionList extends LitElement {

    createRenderRoot () {
        return this;
    }

    render () {
        return html`
            <div class="transaction-list">
            
                <div class="transaction-list__actions p-4">
                    <button class="sw-btn">Refresh</button>
                </div>
               
                <hr>
                
                <div class="transaction-list__content p-4">
                    Transaction list
                </div>
            </div>
        `;
    }
}
