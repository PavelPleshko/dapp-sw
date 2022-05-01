import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { container } from 'tsyringe';
import { ObserveController } from '../shared/async/observe.controller';
import { WalletService } from '../wallet';


@customElement('sw-account-balance')
export class AccountBalance extends LitElement {

    private _walletService = container.resolve(WalletService);

    private _walletStateController = new ObserveController(
        this,
        this._walletService.walletState$,
    );

    createRenderRoot (): AccountBalance {
        return this;
    }


    render (): ReturnType<typeof html> {

        return html`
            <span class="inline-flex border mx-2">
            ${ repeat(this._walletStateController.value.balances,
            null,
            item => {
                return html`
                        <span class="sw-balance-item inline-flex">
                            <b class="p-1">${ item.amount }</b>
                            <span class="sw-balance-item__currency p-1">${ item.currency }</span>
                        </span>
                   
                `;
            }) }
            </span>
        `;
    }

}
