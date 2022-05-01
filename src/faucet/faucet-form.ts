import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { container } from 'tsyringe';
import { ObserveController } from '../shared/async/observe.controller';
import { WalletService } from '../wallet';


@customElement('sw-faucet-form')
export class FaucetForm extends LitElement {

    private _walletService = container.resolve(WalletService);

    private _walletStateController = new ObserveController(
        this,
        this._walletService.walletState$,
    );

    @state()
    amount: number | null = null;

    createRenderRoot (): FaucetForm {
        return this;
    }

    render (): ReturnType<typeof html> {

        return html`
           <form class="flex flex-col" @submit="${ (e: Event) => this._onRequestTokens(e) }">
               <div class="mb-1">
                    <input type="number" 
                     .value="${ this.amount }"
                     @change="${ (e: InputEvent) => this._onAmountInput(e) }" min="0" placeholder="Amount" class="p-1" />
                    of <b>DAI</b>
               </div>
                <button class="sw-btn sw-btn--primary">Submit</button>
           </form>
        `;
    }

    private _onRequestTokens (e: Event): void {
        e.preventDefault();

        this.amount = null;
    }

    // FIXME this should be done through some form inputs abstraction, but for the sake of dev velocity we leave it as is
    private _onAmountInput (e: InputEvent): void {
        this.amount = +(e.target as HTMLInputElement).value;
    }
}
