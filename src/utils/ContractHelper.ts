import { HttpException } from '@nestjs/common/exceptions/http.exception';
import {
    toChecksumAddress,
    checkAddressChecksum,
    asciiToHex,
    keccak256,
    toBN,
    fromWei
  } from 'web3-utils';

export async function getEventsRange(
    contract: any,
    block: number,
    events: string[],
    blockChunk: number = 4999,
    n: number = 1,
): Promise<any> {
    try {
        const evs = await contract.getPastEvents('allEvents', {
            fromBlock: block - n * blockChunk,
            toBlock: block - (n - 1) * blockChunk,
        });
        return evs.filter((i) => events.includes(i.event));
    } catch (err) {
        return getEventsRange(contract, block, events, blockChunk, n);
    }
}

export async function isAddress(walletAddress: string): Promise<any> {
    try {
      if (!walletAddress || walletAddress == 'undefined') {
        throw new Error('invalidAddress');
      }
      const address = toChecksumAddress(walletAddress);
      const check = checkAddressChecksum(address);
      if (!check) throw new Error('invalidAddress');
      return address;
    } catch (e) {
      throw new HttpException('invalidWalletAddress', 400);
    }
  }