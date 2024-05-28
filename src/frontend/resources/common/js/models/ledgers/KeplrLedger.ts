import Ledger from "./Ledger";
import { makeObservable, observable } from "mobx";
import S from "../../utilities/Main";
import Config from "../../../../../../../builds/dev-generated/Config";
import {
  AccountData,
  Coin,
  coin,
  OfflineSigner,
  StargateClient,
  CudosNetworkConsts,
  StdFee,
} from "cudosjs";
import {
  SigningStargateClient,
  assertIsDeliverTxSuccess,
  checkValidAddress,
  estimateFee,
} from "cudosjs";
import { EncodeObject } from "cudosjs";
import BigNumber from "bignumber.js";
import { GasPrice } from "cudosjs";
import { deprecate } from "util";

declare global {
  interface Window {
    keplr: any;
    getOfflineSignerAuto: any;
    meta: any;
  }
}

export default class KeplrLedger implements Ledger {
  @observable connected: number;
  @observable account: string;
  @observable walletError: string;
  @observable txHash: string;
  @observable bridgeFee: BigNumber;
  @observable chainID: string;
  @observable rpcEndpoint: string;
  @observable txNonce: string;
  queryClient: StargateClient;

  static NETWORK_NAME = "CUDOS";

  constructor() {
    this.connected = S.INT_FALSE;
    this.account = null;
    this.walletError = null;
    this.txHash = null;
    this.chainID = Config.CUDOS_NETWORK.CHAIN_ID;
    this.rpcEndpoint = Config.CUDOS_NETWORK.RPC;
    makeObservable(this);
  }

  async connect(): Promise<void> {
    this.walletError = null;
    try {
      await window.keplr.experimentalSuggestChain({
        // Chain-id of the Cosmos SDK chain.
        chainId: Config.CUDOS_NETWORK.CHAIN_ID,
        // The name of the chain to be displayed to the user.
        chainName: Config.CUDOS_NETWORK.CHAIN_NAME,
        // RPC endpoint of the chain.
        rpc: Config.CUDOS_NETWORK.RPC,
        // REST endpoint of the chain.
        rest: Config.CUDOS_NETWORK.API,
        // Staking coin information
        stakeCurrency: {
          // Coin denomination to be displayed to the user.
          coinDenom: CudosNetworkConsts.CURRENCY_DISPLAY_NAME,
          // Actual denom (i.e. uatom, uscrt) used by the blockchain.
          coinMinimalDenom: CudosNetworkConsts.CURRENCY_DENOM,
          // # of decimal points to convert minimal denomination to user-facing denomination.
          coinDecimals: CudosNetworkConsts.CURRENCY_DECIMALS,
          // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
          // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
          coinGeckoId: CudosNetworkConsts.CURRENCY_COINGECKO_ID,
        },
        // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
        // The 'stake' button in Keplr extension will link to the webpage.
        walletUrlForStaking: Config.CUDOS_NETWORK.STAKING,
        // The BIP44 path.
        bip44: {
          // You can only set the coin type of BIP44.
          // 'Purpose' is fixed to 44.
          coinType: CudosNetworkConsts.LEDGER_COIN_TYPE,
        },
        bech32Config: {
          bech32PrefixAccAddr: CudosNetworkConsts.BECH32_PREFIX_ACC_ADDR,
          bech32PrefixAccPub: CudosNetworkConsts.BECH32_PREFIX_ACC_PUB,
          bech32PrefixValAddr: CudosNetworkConsts.BECH32_PREFIX_VAL_ADDR,
          bech32PrefixValPub: CudosNetworkConsts.BECH32_PREFIX_VAL_PUB,
          bech32PrefixConsAddr: CudosNetworkConsts.BECH32_PREFIX_CONS_ADDR,
          bech32PrefixConsPub: CudosNetworkConsts.BECH32_PREFIX_CONS_PUB,
        },
        // List of all coin/tokens used in this chain.
        currencies: [
          {
            // Coin denomination to be displayed to the user.
            coinDenom: CudosNetworkConsts.CURRENCY_DISPLAY_NAME,
            // Actual denom (i.e. uatom, uscrt) used by the blockchain.
            coinMinimalDenom: CudosNetworkConsts.CURRENCY_DENOM,
            // # of decimal points to convert minimal denomination to user-facing denomination.
            coinDecimals: CudosNetworkConsts.CURRENCY_DECIMALS,
            // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
            // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
            coinGeckoId: CudosNetworkConsts.CURRENCY_COINGECKO_ID,
          },
        ],
        // List of coin/tokens used as a fee token in this chain.
        feeCurrencies: [
          {
            // Coin denomination to be displayed to the user.
            coinDenom: CudosNetworkConsts.CURRENCY_DISPLAY_NAME,
            // Actual denom (i.e. uatom, uscrt) used by the blockchain.
            coinMinimalDenom: CudosNetworkConsts.CURRENCY_DENOM,
            // # of decimal points to convert minimal denomination to user-facing denomination.
            coinDecimals: CudosNetworkConsts.CURRENCY_DECIMALS,
            // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
            // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
            // coinGeckoId: Meteor.settings.public.coingeckoId,
            gasPriceStep: {
              low: Number(Config.CUDOS_NETWORK.GAS_PRICE),
              average: Number(Config.CUDOS_NETWORK.GAS_PRICE) * 2,
              high: Number(Config.CUDOS_NETWORK.GAS_PRICE) * 4,
            },
          },
        ],
        // (Optional) The number of the coin type.
        // This field is only used to fetch the address from ENS.
        // Ideally, it is recommended to be the same with BIP44 path's coin type.
        // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
        // So, this is separated to support such chains.
        /*  deprecated */
        /*    coinType: CudosNetworkConsts.LEDGER_COIN_TYPE, */
        // (Optional) This is used to set the fee of the transaction.
        // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
        // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
        // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
      });
    } catch (ex) {
      this.walletError = "Failed to suggest the chain";
    }

    // You should request Keplr to enable the wallet.
    // This method will ask the user whether or not to allow access if they haven't visited this website.
    // Also, it will request user to unlock the wallet if the wallet is locked.
    // If you don't request enabling before usage, there is no guarantee that other methods will work.
    try {
      await window.keplr.enable(Config.CUDOS_NETWORK.CHAIN_ID);

      window.keplr.defaultOptions = {
        sign: {
          preferNoSetFee: true,
        },
      };

      const [_, account] = await this.GetKeplrSignerAndAccount();
      this.account = account.address;

      // Instantiating the queryClient just once - since it's not tied to a particular account.
      // This is more performant
      this.queryClient = await StargateClient.connect(Config.CUDOS_NETWORK.RPC);
      this.connected = S.INT_TRUE;
    } catch (error) {
      if (!window.keplr) {
        this.walletError =
          "Keplr wallet not found! Please install to continue!";
      } else {
        this.walletError = "Failed to connect to Keplr!";
      }
    }
  }

  async disconnect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }

  GetKeplrSignerAndAccount = async (): Promise<
    [OfflineSigner, AccountData]
  > => {
    const offlineSigner = await window.getOfflineSignerAuto(this.chainID);
    const account = (await offlineSigner.getAccounts())[0];
    return [offlineSigner, account];
  };

  GetKeplrSigningClient = async (
    offlineSigner: OfflineSigner
  ): Promise<SigningStargateClient> => {
    const client = await SigningStargateClient.connectWithSigner(
      this.rpcEndpoint,
      offlineSigner
    );
    return client;
  };

  async send(amount: BigNumber, destinationAddress: string): Promise<void> {
    await window.keplr.enable(this.chainID);
    const [offlineSigner, account] = await this.GetKeplrSignerAndAccount();
    const client = await this.GetKeplrSigningClient(offlineSigner);

    this.walletError = null;
    try {
      const coinAmount: Coin = coin(
        amount.multipliedBy(CudosNetworkConsts.CURRENCY_1_CUDO).toString(10),
        CudosNetworkConsts.CURRENCY_DENOM
      );
      const bridgeFeeAmount: Coin = coin(
        this.bridgeFee.toString(10),
        CudosNetworkConsts.CURRENCY_DENOM
      );
      const gasPrice: GasPrice = GasPrice.fromString(
        `${Config.CUDOS_NETWORK.GAS_PRICE}acudos`
      );

      const result = await client.gravitySendToEth(
        account.address,
        destinationAddress,
        coinAmount,
        bridgeFeeAmount,
        gasPrice,
        "Sent with CUDOS Bridge"
      );

      this.txHash = result.transactionHash;
      assertIsDeliverTxSuccess(result);
    } catch (e) {
      throw new Error((this.walletError = "Failed to send transaction!"));
    }
  }

  async EstimateFee(
    client: SigningStargateClient,
    sender: string,
    messages: EncodeObject[],
    gasPrice: GasPrice,
    memo?: string,
    gasMultiplier?: number
  ): Promise<StdFee> {
    const fee = await estimateFee(
      client,
      sender,
      messages,
      gasPrice,
      gasMultiplier,
      memo
    );
    return fee;
  }

  async getBalance(): Promise<BigNumber> {
    this.walletError = null;
    try {
      const [_, account] = await this.GetKeplrSignerAndAccount();
      const balance: Coin = await this.queryClient.getBalance(
        account.address,
        CudosNetworkConsts.CURRENCY_DENOM
      );

      return new BigNumber(balance.amount).div(
        CudosNetworkConsts.CURRENCY_1_CUDO
      );
    } catch (e) {
      this.walletError = "Failed to get balance!";
    }
  }

  setBridgeFee(bridgeFee: BigNumber) {
    if (
      bridgeFee.lt(
        new BigNumber(1).dividedBy(CudosNetworkConsts.CURRENCY_1_CUDO)
      )
    ) {
      return;
    }

    this.bridgeFee = bridgeFee;
  }

  isAddressValid(address: string): boolean {
    try {
      checkValidAddress(address);
      return true;
    } catch {
      this.walletError = "Invalid Cosmos Address";
      return false;
    }
  }
}
