import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';

export class StateManager<T> {

    protected _initialState: T;

    protected _state$ = new BehaviorSubject<T>(undefined as unknown as T);

    get rawState (): T {
        return this._state$.getValue();
    }

    state$: Observable<T> = this._state$.pipe(
        distinctUntilChanged(),
    );

    constructor (state?: T) {
        if (state) {
            this._initialState = state;
        }
        this._state$.next(this._initialState);
    }

    pushChange (slice: Readonly<Partial<T>>): void {
        this._state$.next({ ...this._state$.getValue(), ...slice });
    }

    /**
     * Allows to pass the state change function that has previous state
     * as first argument. The returned value is a slice of state that needs
     * to be merged.
     */
    setChange (stateChangeFn: (prev: Readonly<T>) => Readonly<Partial<T>>): void {
        const changedSlice = stateChangeFn(this._state$.getValue());
        this.pushChange(changedSlice);
    }

    /**
     * Get to initial state
     */
    reset (): void {
        this._state$.next(this._initialState);
    }
}
