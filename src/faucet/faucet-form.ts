import { parseUnits } from 'ethers/lib/utils';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { filter, map, switchMap, take } from 'rxjs';
import { container } from 'tsyringe';
import { createMachine, interpret } from 'xstate';
import { Currency } from '../shared/currency';
import { Erc20Api } from '../tokens/erc20.api';
import { WalletService } from '../wallet';


@customElement('sw-faucet-form')
export class FaucetForm extends LitElement {

    private _walletService = container.resolve(WalletService);

    private _erc20DaiApi = container.resolve<Erc20Api>(Currency.DAI);

    private _faucetFormState = createMachine({
        id: 'faucetForm',
        initial: 'idle',
        states: {
            idle: {
                on: {
                    LOAD: 'loading',
                },
            },
            loading: {
                on: {
                    SUCCESS: 'idle',
                    ERROR: 'error',
                },
            },
            error: {
                on: {
                    LOAD: 'loading',
                },
            },
        },
        context: {},
    });

    private _faucetStateService = interpret(this._faucetFormState)
        .onTransition(() => this.requestUpdate())
        .start();

    @state()
    amount: number | null = null;

    createRenderRoot (): FaucetForm {
        return this;
    }

    render (): ReturnType<typeof html> {
        const isLoading = this._faucetStateService.state.matches('loading' as any);

        return html`
           <form class="flex flex-col" @submit="${ (e: Event) => this._onRequestTokens(e) }">
               <div class="mb-1">
                    <input type="number"
                     .value="${ this.amount }"
                     @input="${ (e: InputEvent) => this._onAmountInput(e) }" min="0" placeholder="Amount" class="p-1" />
                    of <b>DAI</b>
               </div>
                <button class="sw-btn sw-btn--primary" .disabled="${ !this.amount || isLoading }">
                    ${ isLoading ? 'Requesting' : 'Request' }
                </button>
           </form>
        `;
    }

    private _onRequestTokens (e: Event): void {
        e.preventDefault();
        this._faucetStateService.send('LOAD');
        this._walletService.walletState$.pipe(
            map(({ wallet }) => wallet),
            filter(Boolean),
            take(1),
            switchMap(address => this._erc20DaiApi.faucet(address, parseUnits(`${ this.amount || '' }`, 18).toString())),
        ).subscribe(() => {
            this._resetForm();
            this._faucetStateService.send('SUCCESS');
        }, () => this._faucetStateService.send('ERROR'));
    }


    // FIXME this should be done through some form inputs abstraction, but for the sake of dev velocity we leave it as is
    private _onAmountInput (e: InputEvent): void {
        this.amount = +(e.target as HTMLInputElement).value;
    }

    private _resetForm (): void {
        this.amount = null;
    }
}
