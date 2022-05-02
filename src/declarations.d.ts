import { providers } from 'ethers';

declare global {
    interface Window {
        ethereum: providers.ExternalProvider;
    }
}

declare module '*.json' {
    const value: unknown;
    export default value;
}
