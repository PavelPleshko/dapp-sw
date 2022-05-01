export function ETHEREUM_PROVIDER_FACTORY (): Window['ethereum'] {
    return window.ethereum;
}

export const ETHEREUM_TOKEN = Symbol('__ETHEREUM_TOKEN__');
