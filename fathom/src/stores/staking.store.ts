import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from ".";
import IStakingService from "../services/interfaces/IStakingService";
import ICollatralPool from "./interfaces/ICollatralPool";
import ILockPosition from "./interfaces/ILockPosition";

export default class StakingStore {
  Stakings: ILockPosition[] = [];
  service: IStakingService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IStakingService) {
    makeAutoObservable(this);
    this.service = service;
    this.rootStore = rootStore;
  }

  createLock = async (
    address:string,
    stakePosition:number, 
    unlockPeriod: number
  ) => {
    console.log(
      "Running createLock from store"
    );
    try {
      if (address === undefined || address === null) return;

      await this.service.createLock(
        address,
        500, 
        2
      );
    } catch (e) {
      this.rootStore.alertStore.setShowErrorAlert(
        true,
        "There is some error in Creating Lock postion!"
      );
    }
  };

//   closeStaking = async (
//     StakingId: string,
//     pool: ICollatralPool,
//     address: string,
//     fathomToken: number
//   ) => {
//     console.log(
//       `Close Staking clicked for address ${address}, StakingId: ${StakingId}, fathomToken: ${fathomToken}`
//     );
//     try {
//       if (address === undefined || address === null) return;

//       await this.service.closeStaking(
//         StakingId,
//         pool,
//         address,
//         fathomToken,
//         this.rootStore.transactionStore
//       );
//       await this.fetchStakings(address);
//       await this.rootStore.poolStore.fetchPools();
//       this.rootStore.alertStore.setShowSuccessAlert(
//         true,
//         "Staking closed successfully!"
//       );
//     } catch (e) {
//       this.rootStore.alertStore.setShowErrorAlert(
//         true,
//         "There is some error in closing the Staking!"
//       );
//     }
//   };

//   fetchStakings = async (address: string) => {
//     if (address === undefined || address === null) return;

//     let Stakings = await this.service.getStakingsWithSafetyBuffer(address);
//     runInAction(() => {
//       this.setStakings(Stakings);
//     });
//   };

//   setStakings = (_Stakings: ILockPosition[]) => {
//     this.Stakings = _Stakings;
//   };
}
