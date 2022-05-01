import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export const copyToClipboard = (str: string): void => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};


@customElement('sw-copy-button')
export class CopyToClipboard extends LitElement {

    @property()
    textToCopy = '';

    @property()
    defaultText = 'Copy';

    @state()
    visibleText = this.defaultText;

    createRenderRoot (): CopyToClipboard {
        return this;
    }

    protected render (): ReturnType<typeof html> {
        return html`
            <slot></slot>
            <button class="sw-btn sw-btn--flat" @click="${ () => this._executeCopy() }">
                ${ this.visibleText }
            </button>
        `;
    }

    private _executeCopy (): void {
        copyToClipboard(this.textToCopy);
        this.visibleText = 'Copied!';
        setTimeout(() => this.visibleText = this.defaultText, 500);
    }
}
