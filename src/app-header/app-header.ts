import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { container } from 'tsyringe';
import { ObserveController } from '../shared/async/observe.controller';
import { trimAddress } from '../shared/trim.directive';
import { WalletService } from '../wallet';
import '../shared/copy-to-clipboard';

@customElement('app-header')
export class AppHeader extends LitElement {
    private _walletService = container.resolve(WalletService);

    private _walletStateController = new ObserveController(
        this,
        this._walletService.walletState$,
    );

    createRenderRoot (): AppHeader {
        return this;
    }

    render (): ReturnType<typeof html> {

        return html`
            <div class="flex justify-between">
            
                   <h1 class="text-xl">Swivel homework</h1>
                   <div class="sw-wallet-info">
                    ${ this._getAddressTemplate() }
                     <button class="sw-btn sw-btn--primary"
                               ?aria-busy="${ this._walletStateController.value.isConnecting }"
                               @click="${ () => this._toggleConnection() }">
                               ${ when(
            this._walletStateController.value.isConnecting,
            () => 'Connecting',
            () => this._walletStateController.value.wallet ? 'Disconnect' : 'Connect Metamask',
        ) }
                       </button>    
                  </div>
                
                   
            </div>
        `;
    }

    private _getAddressTemplate (): ReturnType<typeof html> | null {
        const address = this._walletStateController.value.wallet || '';
        return address ? html`
                    <sw-copy-button .textToCopy="${ address }">
                          ${ trimAddress(address) }
                    </sw-copy-button>
                ` : null;
    }

    private _toggleConnection (): void {
        void this._walletService.toggleConnection();
    }
}
