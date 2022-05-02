import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import 'reflect-metadata';
import { container, registry } from 'tsyringe';
import './app-header/app-header';
import './faucet/faucet-form';
import { APP_INITIALIZER } from './shared/app.initializer';
import { TOKENS_INIT_FACTORY } from './tokens/tokens.provider';
import './transaction-list/components/transaction-list';
import { ETHEREUM_PROVIDER_FACTORY, ETHEREUM_TOKEN } from './web3/ethereum';

@customElement('app-root')
@registry([
    { token: ETHEREUM_TOKEN, useFactory: ETHEREUM_PROVIDER_FACTORY },
    { token: APP_INITIALIZER, useFactory: TOKENS_INIT_FACTORY },
])
export class AppRoot extends LitElement {

    private _intializers = container.resolveAll(APP_INITIALIZER);

    createRenderRoot (): AppRoot {
        return this;
    }

    render (): ReturnType<typeof html> {
        return html`
            <div class="sw-page">
            
                <header class="px-4 py-2 border border-bottom-1">
                    <app-header></app-header> 
                </header>
               
                <main class="flex flex-row overflow-hidden h-full">
                
                    <div class="sw-sidebar basis-1/6 p-4">
                         <sw-faucet-form></sw-faucet-form>
                    </div>
                   
                   <div class="sw-content basis-5/6">
                        <app-transaction-list>
                        </app-transaction-list> 
                   </div>
                  
                </main>
            </div>
        `;
    }
}
