import { ethers, Transaction } from 'ethers';
import { injectable } from 'tsyringe';
import { Web3Service } from '../web3';

export interface ERC20Token extends ethers.Contract {
    allocateTo: (address: string, amount: ethers.BigNumberish) => Promise<Transaction>;
}

@injectable()
export class Erc20Api {

    constructor (
        private _address: string,
        private _tokenName: string,
        private _connectedContract: ERC20Token,
        private _web3: Web3Service,
    ) {}

    faucet (address: string, amount: string): Promise<Transaction> {
        return this._contractWthSigner()
            .allocateTo(address, amount);
    }

    private _contractWthSigner (): ERC20Token {
        return this._connectedContract.connect(
            this._web3.getSigner(),
        ) as ERC20Token;
    }
}
