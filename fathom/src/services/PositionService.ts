import { SmartContractFactory } from "../config/SmartContractFactory";
import IPositionService from "./interfaces/IPositionService";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";
import OpenPosition from "../stores/interfaces/IOpenPosition"
import IOpenPosition from "../stores/interfaces/IOpenPosition"
import BigNumber from "bignumber.js";
import ICollatralPool from "../stores/interfaces/ICollatralPool";
import ActiveWeb3Transactions from "../stores/transaction.store";
import { TransactionStatus, TransactionType } from "../stores/interfaces/ITransaction";



export default class PositionService implements IPositionService{
    

    async openPosition(address:string, pool:ICollatralPool,collatral:number,fathomToken:number,transactionStore:ActiveWeb3Transactions): Promise<void>{
        
        try{
            let proxyWalletaddress = await this.proxyWalletExist(address);

            if(proxyWalletaddress === Constants.ZERO_ADDRESS){
                console.log('Proxy wallet not exist...')
                proxyWalletaddress = await this.createProxyWallet(address)
            }

            console.log(`Open position for proxy wallet ${proxyWalletaddress}...`)

            const wallet = Web3Utils.getContractInstanceFrom(SmartContractFactory.proxyWallet.abi,proxyWalletaddress)
            const encodedResult = Web3Utils.getWeb3Instance().eth.abi.encodeParameters(["address"], [address]);

            let jsonInterface =  SmartContractFactory.FathomStablecoinProxyAction.abi.filter((abi) => abi.name === 'openLockTokenAndDraw')[0]  

            let openPositionCall =  Web3Utils.getWeb3Instance().eth.abi.encodeFunctionCall(jsonInterface, [
                SmartContractFactory.PositionManager.address,
                SmartContractFactory.StabilityFeeCollector.address,
                pool.CollateralTokenAdapterAddress,
                SmartContractFactory.StablecoinAdapter.address,
                pool.id,
                Constants.WeiPerWad.multipliedBy(collatral).toString(),
                Constants.WeiPerWad.multipliedBy(fathomToken).toString(),
                '1',
                encodedResult,
            ]);

            const BEP20 = Web3Utils.getContractInstance(SmartContractFactory.BEP20(pool.collatralContractAddress))
            
            await BEP20.methods.approve(proxyWalletaddress, Constants.WeiPerWad.multipliedBy(collatral)).send({from:address}).on('transactionHash', (hash:any) => {
                transactionStore.addTransaction({hash:hash, type:TransactionType.Approve,active:false, status:TransactionStatus.None})
            })
           
            await wallet.methods.execute2(SmartContractFactory.FathomStablecoinProxyActions.address, openPositionCall).send({from:address}).on('transactionHash', (hash:any) => {
                transactionStore.addTransaction({hash:hash, type:TransactionType.OpenPosition,active:false, status:TransactionStatus.None})
            })

        }catch(error){
            throw error;
        }
    }

    //Create a proxy wallet for a user
    async createProxyWallet(address:string): Promise<string>{
        try{
            console.log('Crteating a proxy wallet...')
            let proxyWalletRegistry = Web3Utils.getContractInstance(SmartContractFactory.ProxyWalletRegistry)
            await proxyWalletRegistry.methods.build(address).send({from:address});
            let proxyWallet = await proxyWalletRegistry.methods.proxies(address).call();
            return proxyWallet;
        }catch(error){
            console.error(`Error in createProxyWallet: ${error}`)
            throw error;
        }
    }

    //Check if proxy wallet for a user
    async proxyWalletExist(address:string): Promise<string>{
        try{
            console.log(`Check if proxy wallet exist for address: ${address}`)
            let proxyWalletRegistry = Web3Utils.getContractInstance(SmartContractFactory.ProxyWalletRegistry)
            let proxyWallet = await proxyWalletRegistry.methods.proxies(address).call();
            return proxyWallet;
        }catch(error){
            console.error(`Error in proxyWalletExist: ${error}`)
            throw error;
        }
    }

    async getPositionsForAddress(address:string): Promise<IOpenPosition[]>{
        try{
            console.log(`getting Positions For Address ${address}.`)
            let proxyWallet = await this.proxyWalletExist(address);
            let getPositionsContract = Web3Utils.getContractInstance(SmartContractFactory.GetPositions)
            let response = await getPositionsContract.methods.getAllPositionsAsc(SmartContractFactory.PositionManager.address,proxyWallet).call();

            const { 0: positionIds, 1: positionAddresses, 2: collateralPools } = response;
            let fetchedPositions:IOpenPosition[] = [];
            let index = 0;
            positionIds.forEach((positionId:string) => {
                let positionAddress = positionAddresses[index];
                let collateralPool = collateralPools[index];
                let position = new OpenPosition(positionId, positionAddress, collateralPool);
                fetchedPositions.push(position);
                index++;
            });

            console.log(`All Open Positions... ${JSON.stringify(fetchedPositions)}`)
            return fetchedPositions;

        }catch(error){
            console.error(`Error in getting Positions: ${error}`)
            throw error;
        }
    }

    //TODO: Externalize the pagination
    //TODO: Find better ways to filter out the posistions.
    async getPositionsWithSafetyBuffer(address:string): Promise<IOpenPosition[]>{
        try{
            console.log(`getting Positions With Safety Buffer For Address ${address}.`)
            let myPositions = await this.getPositionsForAddress(address);
            let getPositionsContract = Web3Utils.getContractInstance(SmartContractFactory.GetPositions)
            let response = await getPositionsContract.methods.getPositionWithSafetyBuffer(SmartContractFactory.PositionManager.address,1,100).call();

            console.log(`Raw response from getPositionsWithSafetyBuffer: ${JSON.stringify(response)}`)

            const { 0: positionAddresses, 1: debtShares, 2: safetyBuffers } = response;

            let fetchedPositions:IOpenPosition[] = [];
            let index = 0;
            positionAddresses.forEach((positionAddress:string) => {
                let position = myPositions.filter((pos) => pos.address === positionAddress)[0] as IOpenPosition
                
                if(position && debtShares[index] > 0){
                    position.setDebtShare(new BigNumber(debtShares[index]))
                    position.setSafetyBuffer(new BigNumber(safetyBuffers[index]))
                    fetchedPositions.push(position);
                }
                index++;
            });

            console.log(`All Open Positions... ${JSON.stringify(fetchedPositions)}`)
            return fetchedPositions;

        }catch(error){
            console.error(`Error in getting Positions: ${error}`)
            throw error;
        }

       
    }

    async closePosition(positionId: string,pool:ICollatralPool,address:string, debt:number,transactionStore:ActiveWeb3Transactions): Promise<void> {
        try{
            console.log(`Closing position for position id ${positionId}.`)
            let proxyWalletaddress = await this.proxyWalletExist(address);
            const wallet = Web3Utils.getContractInstanceFrom(SmartContractFactory.proxyWallet.abi,proxyWalletaddress)
        
            
            const fathomStableCoin = Web3Utils.getContractInstance(SmartContractFactory.FathomStableCoin)
            
            await fathomStableCoin.methods.approve(proxyWalletaddress, Constants.WeiPerWad.multipliedBy(debt)).send({from:address}).on('transactionHash', (hash:any) => {
                transactionStore.addTransaction({hash:hash, type:TransactionType.Approve,active:false, status:TransactionStatus.None})
            })

            const encodedResult = Web3Utils.getWeb3Instance().eth.abi.encodeParameters(["address"], [address]);
            let jsonInterface =  SmartContractFactory.FathomStablecoinProxyAction.abi.filter((abi) => abi.name === 'wipeAllAndUnlockToken')[0]  
    
         
            let wipeAllAndUnlockTokenCall =  Web3Utils.getWeb3Instance().eth.abi.encodeFunctionCall(jsonInterface, [
              SmartContractFactory.PositionManager.address,
              pool.CollateralTokenAdapterAddress,
              SmartContractFactory.StablecoinAdapter.address,
              positionId,
              debt,
              encodedResult,
            ]);
    
            await wallet.methods.execute2(SmartContractFactory.FathomStablecoinProxyActions.address, wipeAllAndUnlockTokenCall).send({from:address}).on('transactionHash', (hash:any) => {
                transactionStore.addTransaction({hash:hash, type:TransactionType.ClosePosition,active:false, status:TransactionStatus.None})
            })
            console.log(`Position closed for position id ${positionId}.`)
            
        }catch(error){
            console.error(`Error in closing position`)
            throw error;
        }
    }

}