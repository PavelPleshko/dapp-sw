import { ethers, BigNumberish, ContractTransaction, ContractReceipt } from 'ethers';
import { injectable } from 'tsyringe';
import { Web3Service } from '../web3';

export interface ERC20Token extends ethers.Contract {
    allocateTo: (address: string, amount: BigNumberish) => Promise<ContractTransaction>;

    balanceOf: (address: string) => Promise<BigNumberish>;
}

@injectable()
export class Erc20Api {

    constructor (
        private _address: string,
        private _tokenName: string,
        private _tokenContract: ERC20Token,
        private _web3: Web3Service,
    ) {}

    faucet (address: string, amount: string): Promise<ContractReceipt> {
        return this._connectedContract()
            .allocateTo(address, amount).then(tx => tx.wait());
    }

    getBalance (address: string): Promise<BigNumberish> {
        return this._connectedContract()
            .balanceOf(address);
    }

    private _connectedContract (): ERC20Token {
        return this._tokenContract.connect(
            this._web3.getSigner() || this._web3.provider,
        ) as ERC20Token;
    }
}
