import { noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import { Observable, Subscription } from 'rxjs';


class ObserveDirective<T extends Observable<unknown>> extends AsyncDirective {
    private _observable?: T;

    private _subscription?: Subscription;

    render (observable: T): typeof noChange {
        console.log('hello');
        if (this._observable !== observable) {
            this._unsubscribe();
            this._observable = observable;
            if (this.isConnected) {
                this._subscribe(observable);
            }
        }
        return noChange;
    }

    reconnected (): void {
        this._subscribe(this._observable as T);
    }

    disconnected (): void {
        this._unsubscribe();
    }

    private _subscribe (observable: T): void {
        this._subscription = observable.subscribe(value => this.setValue(value));
    }

    private _unsubscribe (): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}

export const observe = directive(ObserveDirective);
