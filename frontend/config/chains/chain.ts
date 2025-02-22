import type { ChainWithTokens } from '@/types/config';
import type { NativeCurrency } from '@/types/data';

import type { TokenMetadata } from '../tokens/token';
import { readFileJsonContent } from '../utils';

export class ChainMetadata {
  readonly identifier: number;
  readonly explorerUrl: string;
  readonly rpcUrl: string;
  readonly name: string;
  readonly imageUrl?: string;
  readonly tokenSymbols: Array<string>;
  readonly nativeCurrency?: NativeCurrency;
  readonly internalRpcUrl: string;

  constructor(data: ChainMetadataData) {
    this.identifier = data.identifier;
    this.explorerUrl = data.explorerUrl;
    this.rpcUrl = data.rpcUrl;
    this.name = data.name;
    this.imageUrl = data.imageUrl;
    this.tokenSymbols = data.tokenSymbols ?? [];
    this.nativeCurrency = data.nativeCurrency;
    this.internalRpcUrl = data.internalRpcUrl;
  }

  public formatUsingTokenMetas(tokenMetas: TokenMetadata[]): Partial<ChainWithTokens> {
    const chainId = String(this.identifier);
    const tokens = tokenMetas
      .filter((tokenMeta) =>
        this.tokenSymbols.some(
          (symbol) => tokenMeta.symbol.toLowerCase() === symbol.toLowerCase(),
        ),
      )
      .filter((tokenMeta) => tokenMeta.isChainSupported(chainId))
      .map((tokenMeta) => tokenMeta.formatByChainId(chainId));

    return {
      ...this,
      tokens: tokens,
    };
  }

  static readFromFile(filePath: string): ChainMetadata {
    try {
      return new this(readFileJsonContent(filePath) as ChainMetadataData);
    } catch (e) {
      throw new Error(`[ChainMetadata]: Failed parsing ${filePath}.`);
    }
  }
}

export type ChainMetadataData = {
  identifier: number;
  explorerUrl: string;
  rpcUrl: string;
  name: string;
  imageUrl?: string;
  tokenSymbols: Array<string>;
  nativeCurrency?: NativeCurrency;
  internalRpcUrl: string;
};
