import type { Provider } from "@ethersproject/providers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "ethers";

import type { ArbitrumRelayerService } from "./arbitrum";
import type { BobaRelayerService } from "./boba";
import type { EthereumRelayerService } from "./ethereum";
import type { OptimismRelayerService } from "./optimism";

export type TransactionHash = string;

export type ExtendedRelayerService =
  | typeof ArbitrumRelayerService
  | typeof BobaRelayerService
  | typeof OptimismRelayerService
  | typeof EthereumRelayerService;

export abstract class BaseRelayerService {
  readonly l1Wallet: Wallet;
  readonly l2Wallet: Wallet;
  readonly fromL2ChainId: number;
  readonly toL2ChainId: number;

  constructor(
    l1RpcURL: string,
    l2RpcURL: string,
    privateKey: string,
    fromL2ChainId: number,
    toL2ChainId: number,
  ) {
    this.l1Wallet = new Wallet(privateKey, new JsonRpcProvider(l1RpcURL));
    this.l2Wallet = new Wallet(privateKey, new JsonRpcProvider(l2RpcURL));
    this.fromL2ChainId = fromL2ChainId;
    this.toL2ChainId = toL2ChainId;
  }

  get l2RpcProvider(): Provider {
    return this.l2Wallet.provider;
  }

  get l1RpcProvider(): Provider {
    return this.l1Wallet.provider;
  }

  async getL1ChainId() {
    return (await this.l1RpcProvider.getNetwork()).chainId;
  }

  async getL2ChainId() {
    return (await this.l2RpcProvider.getNetwork()).chainId;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addCustomNetwork(_filePath: string): void {
    return;
  }

  abstract prepare(): Promise<boolean>;
  abstract relayTxToL1(l2TransactionHash: TransactionHash): Promise<TransactionHash | undefined>;
  abstract finalize(l1TransactionHash: TransactionHash): Promise<void>;
}
