import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Currency } from '../../shared/currency';
import { formatCurrency } from '../../shared/number-utils/fixed.number';
import { trimAddress } from '../../shared/trim.directive';
import { Transaction } from '../api/transactions.api';

@customElement('app-transaction-item')
export class TransactionItem extends LitElement {

    @property()
    transaction: Transaction;


    createRenderRoot (): TransactionItem {
        return this;
    }

    render (): ReturnType<typeof html> {
        return html`
            <ul>
                <li>
                    <span>Date</span><span>${ new Date(+this.transaction.timeStamp * 1000).toUTCString() }</span>
                </li>
                <li>
                    <span>From</span><span>${ this.transaction.from }</span>
                </li>
                <li>
                    <span>To</span><span>${ this.transaction.to }</span>
                </li>
                 <li>
                    <span>Amount</span><span>${ formatCurrency(this.transaction.value, Currency.ETH) } <b>ETH</b></span>
                </li>
                 <li>
                    <span>Fee</span><span>${ formatCurrency(this.transaction.gasUsed * this.transaction.gasPrice, Currency.ETH, 10) } <b>ETH</b></span>
                </li>
                <li>
                    <span>Etherscan</span><span>${ trimAddress(this.transaction.hash) }</span>
                </li>
            </ul>
       `;
    }

}
