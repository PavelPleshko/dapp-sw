import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-root')
export class AppRoot extends LitElement {

    createRenderRoot() {
        return this;
    }

    render () {
        return html`
            <div class="py-2">
               <div class="container mx-auto flex justify-between">
                   <h1 class="text-xl">Swivel homework</h1>
                   <button class="sw-btn sw-btn--primary">
                      Connect Metamask
                   </button> 
                </div>
                <div>
                    Content area
                </div>
            </div>
        `;
    }
}
