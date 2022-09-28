import { SmartContractFactory } from "../config/SmartContractFactory";
import IStakingService from "./interfaces/IStakingService";
import { Web3Utils } from "../helpers/Web3Utils";
import IProposal from "../stores/interfaces/IProposal";
import IVoteCounts from "../stores/interfaces/IVoteCounts";
import ActiveWeb3Transactions from "../stores/transaction.store";
import {
  TransactionStatus,
  TransactionType,
} from "../stores/interfaces/ITransaction";
import { Constants } from "../helpers/Constants";
import ILockPosition from "../stores/interfaces/ILockPosition";



export default class StakingService implements IStakingService {
  chainId = 51;


  async createLock(
    address:string,
    stakePosition:number, 
    unlockPeriod: number,
  ): Promise<void> {
    try {
    if(this.chainId){

      const MainToken = Web3Utils.getContractInstance(
        SmartContractFactory.MainToken(this.chainId),
        this.chainId
      )
      console.log("HERE1")
      console.log("SmartContractFactory.Staking(this.chainId).address:  ")
      console.log(SmartContractFactory.Staking(this.chainId).address)

      console.log("Constants.WeiPerWad.multipliedBy(stakePosition).toString()")
      console.log(Constants.WeiPerWad.multipliedBy(stakePosition).toString())
      
      await MainToken.methods.approve(
        '0xA82a7351ccd2949566305850A0877BA86E0e6a33',
        //SmartContractFactory.Staking(this.chainId).address,
        Constants.WeiPerWad.multipliedBy(stakePosition).toString()
      ).send({from:address})

      const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(this.chainId),
        this.chainId
      )
      const day = 24 * 60 * 60;
      console.log("timestamp  HERE: ", (await this.getTimestamp()).toString())
      let lockingPeriod = unlockPeriod * day;
      let endTime =await this.getTimestamp();
      if(endTime){
        endTime = endTime + lockingPeriod;
      }

      if (lockingPeriod > 0) {
               endTime = await this.getTimestamp() + lockingPeriod;
             }

      await Staking.methods.createLock(
        Constants.WeiPerWad.multipliedBy(stakePosition).toString(),
        endTime
      ).send({from:address})
    }
    } catch (err) {
        console.log(err);
    }


  }


  async getLockPositions(account:string): Promise<ILockPosition[]>{
    console.log('.....chianID',this.chainId)
   // let totalStakedPosition = 0;
    let lockPosition = {} as ILockPosition;
    let lockPositionsList = []
    try{
    
    const Staking = Web3Utils.getContractInstance(
        SmartContractFactory.Staking(this.chainId),this.chainId
      )

    const StakingGetter = Web3Utils.getContractInstance(
        SmartContractFactory.StakingGetter(this.chainId),this.chainId
    )

    const result = Staking.methods.getLocksLength(
        account
    ).call()

    for (let i = 0; i < Number(result); i++){
        lockPosition= Staking.methods.getLock(
            account,
            i+1
        ).call()

        lockPositionsList.push(lockPosition)
      //  totalStakedPosition += lockPosition.MAINTokenBalance;
    }
        return lockPositionsList;   
    }catch(error){
        console.error(`Error in fetching Locks: ${error}`);
        return [];
    }
  }

  async getTimestamp(): Promise<number> {
         console.log(`getTimestamp`);
        const web3 = Web3Utils.getWeb3Instance(this.chainId)
        var blockNumber = await web3.eth.getBlockNumber();
        var block = await web3.eth.getBlock(blockNumber);
        var timestamp = block.timestamp
        return timestamp;
      }


  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}

// --------------------------------------------------------------------------------------


// export default class StakingService implements IStakingService {
//   chainId = 51;
//   async createLock(
//     address:string,
//     stakePosition:number, 
//     unlockPeriod: number,
//     transactionStore:ActiveWeb3Transactions,
//   ): Promise<void> {
//     try {
//     if(this.chainId){
//       const web3 = Web3Utils.getWeb3Instance(this.chainId)

//       const MainToken = Web3Utils.getContractInstance(
//         SmartContractFactory.MainToken(this.chainId)
//       )
      
//       await MainToken.methods.approve(
//         SmartContractFactory.Staking(this.chainId).address,
//         Constants.WeiPerWad.multipliedBy(stakePosition).toString()
//       ).send({from:address})


//       const Staking = Web3Utils.getContractInstance(
//         SmartContractFactory.Staking(this.chainId)
//       )
//       const day = 24 * 60 * 60;
//       console.log("timestamp: ", (await this.getTimestamp()).toString())
//       let lockingPeriod = unlockPeriod * day;
//       let endTime =await this.getTimestamp();
//       if(endTime){
//         endTime = endTime + lockingPeriod;
//       }

//       if (lockingPeriod > 0) {
//                endTime = await this.getTimestamp() + lockingPeriod;
//              }

//       await Staking.methods.createLock(
//         Constants.WeiPerWad.multipliedBy(stakePosition).toString(),
//         endTime
//       ).send({from:address})
//     }


//     }catch (error) {
//       console.error(`Error in Creating Lock: ${error}`);
//       throw error;
//     }

//   }

//   async getLockPositions(account:string): Promise<ILockPosition[]>{
//     console.log('.....chianID',this.chainId)
//    // let totalStakedPosition = 0;
//     let lockPosition = {} as ILockPosition;
//     let lockPositionsList = []
//     try{
    
//     const Staking = Web3Utils.getContractInstance(
//         SmartContractFactory.Staking(this.chainId)
//       )

//     const StakingGetter = Web3Utils.getContractInstance(
//         SmartContractFactory.StakingGetter(this.chainId)
//     )

//     const result = Staking.methods.getLocksLength(
//         account
//     ).call()

//     for (let i = 0; i < Number(result); i++){
//         lockPosition= Staking.methods.getLock(
//             account,
//             i+1
//         ).call()

//         lockPositionsList.push(lockPosition)
//       //  totalStakedPosition += lockPosition.MAINTokenBalance;
//     }
//         return lockPositionsList;   
//     }catch(error){
//         console.error(`Error in fetching Locks: ${error}`);
//         return [];
//     }
//   }
//   async handleUnlock(
//     account: string, 
//     lockId: number,
//     chainId: number): Promise<void> {
//         const Staking = Web3Utils.getContractInstance(
//             SmartContractFactory.Staking(this.chainId)
//           )
//           await Staking.methods.unlock(
//             lockId
//           ).send({from:account})
//   }

//   async getTimestamp(): Promise<number> {
//     const web3 = Web3Utils.getWeb3Instance(this.chainId)
//     var blockNumber = await web3.eth.getBlockNumber();
//     var block = await web3.web3.eth.getBlock(blockNumber);
//     var timestamp = block.timestamp
//     return timestamp;
//   }

  

//   setChainId(chainId: number) {
//     this.chainId = chainId;
//   }
// }

