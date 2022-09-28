import ILockPosition from "../../stores/interfaces/ILockPosition";

export default interface IStakingService{
    createLock(
        address:string,
        stakePosition:number, 
        unlockPeriod: number,
      ): Promise<void> ;
      getLockPositions(account:string): Promise<ILockPosition[]>;
}