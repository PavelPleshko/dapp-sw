import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Observable, Subscription } from 'rxjs';

export class ObserveController<T> implements ReactiveController {
    sub: Subscription | null = null;

    value: T;

    constructor (
        private _host: ReactiveControllerHost,
        private _source: Observable<T>,
        public value?: T,
    ) {
        this._host.addController(this);
    }

    hostConnected (): void {
        this.sub = this._source.subscribe(value => {
            this.value = value;
            this._host.requestUpdate();
        });
    }

    hostDisconnected (): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
