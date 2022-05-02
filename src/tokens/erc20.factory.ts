import { ethers } from 'ethers';
import { container, singleton } from 'tsyringe';
import ERC20Abi from '../abi/free-erc20.json';
import { Web3Service } from '../web3';
import { Erc20Api, ERC20Token } from './erc20.api';

@singleton()
export class Erc20Factory {

    constructor (
        private _web3: Web3Service,
    ) {}

    create (
        address: string,
        tokenName: string,
    ): Erc20Api {
        const contract = new ethers.Contract(
            address,
            ERC20Abi,
        ) as ERC20Token;
        const api = new Erc20Api(
            address,
            tokenName,
            contract,
            this._web3,
        );
        container.registerInstance(tokenName, api);
        return api;
    }
}
