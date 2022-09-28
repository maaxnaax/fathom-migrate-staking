import { AbiItem } from "web3-utils";
import CollateralPoolConfigAbi from "./ABI/CollateralPoolConfig.json";
import ProxyWalletRegistryAbi from "./ABI/ProxyWalletRegistry.json";
import ProxyWalletAbi from "./ABI/ProxyWallet.json";
import FathomStablecoinProxyActionAbi from "./ABI/FathomStablecoinProxyActions.json";
import BEP20Abi from "./ABI/BEP20.json";
import GetPositionsAbi from "./ABI/GetPositions.json";
import StableSwapModule from "./ABI/StableSwapModule.json";
import Staking from "./ABI/Staking.json";
import StakingGetter from "./ABI/StakingGetter.json";
import MainToken from "./ABI/MainToken.json";
import Addresses from "./addresses.json";

import Governor from './ABI/Governor.json'

export class SmartContractFactory {
  public static Addresses(chainId: number) {
    try {
      let address: any;
      switch (chainId) {
        case 1337:
          address = Addresses["1337"];
          break;
        case 5:
          address = Addresses["5"];
          break;
        case 51:
          address = Addresses["51"];
          break;
        case 50:
          address = Addresses["50"];
          break;
        default:
          address = Addresses["1337"];
          break;
      }
      return address;
    } catch (e) {
      console.error(`Error in fetching address`);
      return {};
    }
  }

  public static PoolConfig(chainId: number) {
    return {
      abi: CollateralPoolConfigAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).collateralPoolConfig,
    }
  };

  public static ProxyWalletRegistry(chainId: number) {
    return {
      abi: ProxyWalletRegistryAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).proxyWalletRegistry,
    }
  };

  public static proxyWallet = {
    abi: ProxyWalletAbi.abi as AbiItem[],
    address: "",
  };

  public static FathomStablecoinProxyAction(chainId: number) {
    return {
      abi: FathomStablecoinProxyActionAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fathomStablecoinProxyActions,
    }
  };

  public static WXDC(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).WXDC,
    }
  };

  public static USDT(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).USDT,
    }
  };

  public static BEP20 = (_address: string) => {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: _address,
    };
  };

  public static FathomStableCoin(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fathomStablecoin,
    }
  };

  public static PositionManager(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).positionManager,
    }
  };

  public static StabilityFeeCollector(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).stabilityFeeCollector,
    }
  };

  public static WXDCCollateralTokenAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).collateralTokenAdapter,
    }
  };

  public static USDTCollateralTokenAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).collateralTokenAdapterUSDT,
    }
  };

  public static StablecoinAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).stablecoinAdapter,
    }
  };

  public static AuthtokenAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).authTokenAdapter,
    }
  };

  public static FathomStablecoinProxyActions(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).fathomStablecoinProxyActions,
    }
  };

  public static GetPositions(chainId: number) {
    return {
      abi:GetPositionsAbi.abi as AbiItem [],
      address:SmartContractFactory.Addresses(chainId).getPositions
    }
  };

  public static StableSwapModule(chainId: number) {
    return {
      abi: StableSwapModule.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).stableSwapModule,
    }
  };

  public static FathomGovernor(chainId: number)  {
    return {
      abi:Governor.abi as AbiItem [],
      address: SmartContractFactory.Addresses(chainId).fathomGovernor // '0x62f3d571A7DAcC00C047e58fE500ee99A98E3f63'
    }
  }

  public static Staking(chainId: number)  {
    return {
      abi:Staking.abi as AbiItem [],
      address: SmartContractFactory.Addresses(chainId).staking 
    }
  }

  public static MainToken(chainId: number)  {
    return {
      abi:MainToken.abi as AbiItem [],
      address: SmartContractFactory.Addresses(chainId).mainToken // '0x62f3d571A7DAcC00C047e58fE500ee99A98E3f63'
    }
  }

  public static StakingGetter(chainId: number)  {
    return {
      abi:StakingGetter.abi as AbiItem [],
      address: SmartContractFactory.Addresses(chainId).stakingGetter // '0x62f3d571A7DAcC00C047e58fE500ee99A98E3f63'
    }
  }
}
