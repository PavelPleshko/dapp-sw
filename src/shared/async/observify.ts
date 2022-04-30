import { Observable } from 'rxjs';

type SetupFactoryFn<T> = (cb: (data: T) => void) => void;

export const observify = <T>(setupFactory: SetupFactoryFn<T>, teardown: () => void): Observable<T> => {

    return new Observable<T>(observer => {

        const proxyCallback = (data: T): void => {
            observer.next(data);
        };
        setupFactory(proxyCallback);

        return () => teardown();
    });
};
