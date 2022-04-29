import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './app-header/app-header';
import './transaction-list/transaction-list';

@customElement('app-root')
export class AppRoot extends LitElement {

    createRenderRoot () {
        return this;
    }

    render () {
        return html`
            <div class="sw-page">
            
                <div class="px-4 py-2 border border-bottom-1">
                    <app-header></app-header> 
                </div>
               
                <div class="flex flex-row h-full">
                
                    <div class="sw-sidebar basis-1/6 p-4">
                           Sidebar
                    </div>
                   
                    <app-transaction-list class="basis-5/6">
                    </app-transaction-list>
                 
                </div>
            </div>
        `;
    }
}
