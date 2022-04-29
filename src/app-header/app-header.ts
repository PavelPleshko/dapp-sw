import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-header')
export class AppHeader extends LitElement {

    createRenderRoot () {
        return this;
    }

    render () {
        return html`
            <div class="flex justify-between">
            
                   <h1 class="text-xl">Swivel homework</h1>
                   
                   <button class="sw-btn sw-btn--primary">
                      Connect Metamask
                   </button> 
                   
            </div>
        `
    }
}
