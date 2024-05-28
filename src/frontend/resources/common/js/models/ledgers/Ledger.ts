import {
  Coin,
  GasPrice,
  EncodeObject,
  StargateClient,
  SigningStargateClient,
  OfflineSigner,
  AccountData,
  StdFee,
} from "cudosjs";
import BigNumber from "bignumber.js";

export default interface Ledger {
  connected: number;
  account: string;
  walletError: string;
  txHash: string;
  txNonce: string;
  queryClient: StargateClient;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  send: (amount: BigNumber, destination: string) => Promise<void>;
  EstimateFee: (
    client: SigningStargateClient,
    sender: string,
    messages: EncodeObject[],
    gasPrice: GasPrice,
    memo?: string,
    gasMultiplier?: number
  ) => Promise<StdFee>;
  GetKeplrSignerAndAccount: () => Promise<[OfflineSigner, AccountData]>;
  GetKeplrSigningClient: (
    offlineSigner: OfflineSigner
  ) => Promise<SigningStargateClient>;
  isAddressValid: (address: string) => boolean;
  getBalance(): Promise<BigNumber>;
}
