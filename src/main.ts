import 'reflect-metadata';

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { registry } from 'tsyringe';
import './app-header/app-header';
import './transaction-list/components/transaction-list';
import { ETHEREUM_PROVIDER_FACTORY, ETHEREUM_TOKEN } from './web3/ethereum';
import './faucet/faucet-form';

@customElement('app-root')
@registry([
    { token: ETHEREUM_TOKEN, useFactory: ETHEREUM_PROVIDER_FACTORY },
])
export class AppRoot extends LitElement {

    createRenderRoot (): AppRoot {
        return this;
    }

    render (): ReturnType<typeof html> {
        return html`
            <div class="sw-page">
            
                <div class="px-4 py-2 border border-bottom-1">
                    <app-header></app-header> 
                </div>
               
                <div class="flex flex-row h-full">
                
                    <div class="sw-sidebar basis-1/6 p-4">
                         <sw-faucet-form></sw-faucet-form>
                    </div>
                   
                    <app-transaction-list class="basis-5/6">
                    </app-transaction-list>
                 
                </div>
            </div>
        `;
    }
}
