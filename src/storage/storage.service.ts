import { filter, fromEvent, map, merge, Observable, startWith, Subject } from 'rxjs';
import { singleton } from 'tsyringe';

const APP_NAMESPACE = 'SW_HM';

const createKey = (fromKey: string): string => {
    return `${ APP_NAMESPACE }__${ fromKey }`;
};

interface StorageChangeEvent {
    key: string;
    newValue: string | null;
}

@singleton()
export class StorageService {
    private _storage = window.localStorage;

    private _storageChanges$ = new Subject<StorageChangeEvent>();

    setItem (key: string, value: string): void {
        const nsKey = createKey(key);
        this._storage.setItem(nsKey, value);
        this._storageChanges$.next({ key: nsKey, newValue: value });
    }

    removeItem (key: string): void {
        const nsKey = createKey(key);
        this._storage.removeItem(nsKey);
        this._storageChanges$.next({ key: nsKey, newValue: null });
    }

    getItem (key: string): string | null {
        const nsKey = createKey(key);
        return this._storage.getItem(nsKey);
    }

    getItemChanges (key: string): Observable<string | null> {
        const nsKey = createKey(key);

        const otherRealmChanges$ = fromEvent<StorageEvent>(window, 'storage').pipe(
            map(ev => ({ key: ev.key as string, newValue: ev.newValue })),
        );

        return merge(
            otherRealmChanges$,
            this._storageChanges$,
        ).pipe(
            filter(ev => ev.key === nsKey),
            map((ev: StorageChangeEvent) => ev.newValue),
            startWith(this.getItem(key)),
        );
    }
}
