import { Injectable, HttpException } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';

import Web3 from 'web3';

import {
  toChecksumAddress,
  checkAddressChecksum,
  asciiToHex,
  keccak256,
  toBN,
  fromWei
} from 'web3-utils';

import { ABI } from 'config/abi';

import { httpPost } from 'config/helper';

import { RedisService } from 'src/redis.service';

import { OrdersService } from '../orders/orders.service';
import { getEventsRange } from 'src/utils/ContractHelper';
import { DBService } from 'src/database.service';

var Tasks = {
  BUYIDO: false,
  TransferDarling: false,
  TransferItem: false,
  TransferSingleEggs: false,
  TransferBatchEggs: false,
  BuyEgg: false,
  Market721: false,
  Market1155: false
}

let TASKS = {
  BuyIDO: {
    name: 'BUYIDO',
    isProcessing: false,
    abi: ABI.WHITELIST,
    events: ['BuyIDO'],
    address: process.env.SC_WHITELIST
  },
  TransferDarling: {
    name: 'TransferDarling',
    isProcessing: false,
    abi: ABI.DARLING_TOKEN,
    events: ['Transfer']
  },
  TransferItem: {
    name: 'TransferItem',
    isProcessing: false,
    abi: ABI.ITEM_TOKEN,
    events: ['Transfer']
  },
  TransferEggs: {
    name: 'TransferEggs',
    isProcessing: false,
    abi: ABI.EGG_TOKEN,
    events: ['TransferSingle', 'TransferBatch']
  },
  BuyEgg: {
    name: 'BuyEgg',
    isProcessing: false,
    abi: ABI.EGG_SALE,
    events: ['BuyEgg']
  },
  Market721: {
    name: 'Market721',
    isProcessing: false,
    abi: ABI.MARKET_NFT_721,
    events: ['OrderCreated', 'OrderCancelled', 'OrderTaken'],
  },
  Market1155: {
    name: 'Market1155',
    isProcessing: false,
    abi: ABI.MARKET_NFT_1155,
    events: ['OrderCreated', 'OrderCancelled', 'OrderTaken'],
  }
}


// console.log("ABI", ABI)


@Injectable()
export class BSCNetwork {
  private _network: string[] = process.env.BSC_NETWORK.split(',');

  private _networkIndex = 0;

  constructor(private redisService: RedisService, private dbService: DBService) { }

  async getWeb3(networkIndex?: number): Promise<any> {
    const index = networkIndex || this._networkIndex;
    const provider = this._network[index];
    if (!provider) throw new HttpException('web3ConnectFailed', 500);
    try {
      const web3 = new Web3(provider);
      web3['currentBlock'] = await web3.eth.getBlockNumber();
      this._networkIndex = index;
      return web3;
    } catch (err) {
      this._networkIndex = 0;
      console.log('switchBSCNetwork', index + 1);
      return await this.getWeb3(index + 1);
    }
  }





  async hookup(name: string, payload: any): Promise<any> {
    try {
      let res = await httpPost({
        path: process.env['HOOK_API_ENDPOINT_' + name],
        port: +process.env.HOOK_API_PORT,
        payload
      });
      console.log('>> Hookup:', new Date().toISOString(), res);
      return res;
    } catch (e) {
      let error = `** Exception: ${new Date().toISOString()} ${e.message}`;
      console.log(error);
      throw new Error(error);
    }
  }

  async onScanEvent(name: string, cb: Function): Promise<any> {
    // console.log(name, funcName);

    if (TASKS[name].isProcessing)
      return;
    TASKS[name].isProcessing = true;
    // if (!this[funcName]) {
    //   console.log('Exception: ', funcName, 'funcName is undefined');
    //   return;
    // }
    let hash = '';
    try {
      const events = await cb();

      for (const ev of events) {

        hash = `${name}_${ev.tx_hash}`;

        if (await this.redisService.get(hash))
          continue;

        console.log('>> Catch:', new Date().toISOString(), hash, ev);
        await this.redisService.setex(hash, 3600, '1');



        // await this.hookup(name, ev);
      }
    } catch (err) {
      console.error(err);

      await this.redisService.remove([hash]);
    } finally {
      TASKS[name].isProcessing = false
    }
    return true;
  }

  async checkEventProcessed(name, tx_hash) {
    let hash = `${name}_${tx_hash}`;
    return !!(await this.redisService.get(hash));
  }
  async markEventProcessed(name, tx_hash) {
    let hash = `${name}_${tx_hash}`;
    await this.redisService.setex(hash, 3600, '1');
  }

  @Cron('*/3 * * * * *')
  async scanEvents() {
    // console.log(".");
    this.fetchBuyIDOEvents();
    this.fetchTransferDarlingEvents();
    this.fetchTransferItemEvents();
    this.fetchTransferEggEvents();
    this.fetchBatchTransferEggEvents();
    this.fetchEggSaleEvents();
    this.fetch721MarketOrderEvents();
    this.fetch1155MarketOrderEvents();

    // this.onScanEvent('BUYIDO', this.fetchBuyIDOEvents.bind(this));
    // this.onScanEvent('TransferDarling', this.fetchTransferDarlingEvents.bind(this))
    // this.onScanEvent('TransferItem', this.fetchTransferItemEvents.bind(this))
    // this.onScanEvent('TransferSingleEggs', this.fetchTransferEggEvents.bind(this))
    // this.onScanEvent('TransferBatchEggs', this.fetchBatchTransferEggEvents.bind(this))
    // this.onScanEvent('BuyEgg', this.fetchEggSaleEvents.bind(this))

    // this.onScanEvent('Market721', this.fetch721MarketOrderEvents.bind(this));
    // this.onScanEvent('Market1155', this.fetch1155MarketOrderEvents.bind(this));


  }



  async fetch721MarketOrderEvents(blockCount: number = 300): Promise<any[]> {
    const web3 = await this.getWeb3();
    const contract = new web3.eth.Contract(
      ABI.MARKET_NFT_721,
      process.env.SC_MARKET_721,
    );
    // console.log("scan darling events")
    const events = await getEventsRange(
      contract,
      web3.currentBlock,
      ['OrderCreated', 'OrderCancelled', 'OrderTaken'],
      blockCount,
    );

    events.forEach(async event => {
      if (await this.checkEventProcessed(TASKS.Market721.name, event.transactionHash))
        return;

      if (event.event === 'OrderCreated') {
        await this.dbService.createOrder({
          order_id: event.orderId,
          creator: event.creator,
          nft_token: event.nftToken,
          accepted_token: event.acceptedToken,
          token_id: event.tokenId,
          qty: event.quantities,
          target_price: event.targetPrice,
          base_fee_percent: event.baseFeePercent,
          priority_fee: event.priorityFee,
          is_selling: event.isSelling ? 1 : 0,
          remain_qty: event.quantities,
          created_time: event.createdTime,
          expire_time: event.expiredTime,
          state: 'PENDING',
          exec_sc: event.address

        })
      } else if (event.event === 'OrderTaken') {
        await this.dbService.takeOrder({
          order_id: event.orderId,
          nft_token: event.nftToken,
          seller: event.seller,
          buyer: event.buyer,
          qty: event.quantities,
          remain_qty: event.remainingQuantities,
          total_fee: event.totalFees,
          total_price: event.totalPrice,
          tx_hash: event.transactionHash,
          exec_sc:event.address
        })
      } else if (event.event === 'OrderCancelled') {

      }
      await this.markEventProcessed(TASKS.Market721.name, event.transactionHash);
      // await this.redisService.setex(hash, 3600, '1');

    });



    return Promise.all(
      (events || []).map(ev => {
        const { from, to, tokenId } = ev.returnValues;
        return {
          event: ev.event,
          tx_hash: ev.transactionHash,
          data: {
            from: from,
            to: to,
            tokenId: tokenId
          }
        }
      })
    )
  }

  async fetch1155MarketOrderEvents(blockCount: number = 300): Promise<any[]> {
    const web3 = await this.getWeb3();
    const contract = new web3.eth.Contract(
      ABI.MARKET_NFT_1155,
      process.env.SC_MARKET_1155,
    );
    // console.log("scan darling events")
    const events = await getEventsRange(
      contract,
      web3.currentBlock,
      ['OrderCreated', 'OrderCancelled', 'OrderTaken'],
      blockCount,
    );
    return Promise.all(
      (events || []).map(ev => {
        console.log(ev);
        const { from, to, tokenId } = ev.returnValues;
        return {

          tx_hash: ev.transactionHash,
          from: from,
          to: to,
          tokenId: tokenId
        }
      })
    )
  }





  async fetchBuyIDOEvents(blockCount: number = 300): Promise<any[]> {
    const web3 = await this.getWeb3();
    const contract = new web3.eth.Contract(
      ABI.WHITELIST,
      process.env.WHITELIST,
    );
    const events = await getEventsRange(
      contract,
      web3.currentBlock,
      ['BuyIDO'],
      blockCount,
    );
    console.log(events)
    return Promise.all(
      (events || []).map(ev => {
        const { buyer, amountBUSD, amountMTM } = ev.returnValues;
        return {
          tx_hash: ev.transactionHash,
          address: buyer,
          amount: +fromWei(amountBUSD, 'ether'),
          amount_mtm: +amountMTM
        }
      })
    )
  }
  async fetchEggSaleEvents(blockCount: number = 300): Promise<any[]> {
    const web3 = await this.getWeb3();
    const contract = new web3.eth.Contract(
      ABI.EGG_SALE,
      process.env.SC_EGG_SALE,
    );
    const events = await getEventsRange(
      contract,
      web3.currentBlock,
      ['BuyEgg'],
      blockCount,
    );
    return Promise.all(
      (events || []).map(ev => {
        console.log(ev.returnValues)
        const { buyer, price } = ev.returnValues;
        return {
          tx_hash: ev.transactionHash,
          buyer, price
        }
      })
    )
  }
  async fetchTransferDarlingEvents(blockCount: number = 300): Promise<any[]> {
    const web3 = await this.getWeb3();
    const contract = new web3.eth.Contract(
      ABI.DARLING_TOKEN,
      process.env.SC_DARLING_TOKEN,
    );
    // console.log("scan darling events")
    const events = await getEventsRange(
      contract,
      web3.currentBlock,
      ['Transfer'],
      blockCount,
    );
    return Promise.all(
      (events || []).map(ev => {
        // console.log(ev);
        const { from, to, tokenId } = ev.returnValues;
        return {
          tx_hash: ev.transactionHash,
          from: from,
          to: to,
          tokenId: tokenId
        }
      })
    )
  }
  async fetchTransferItemEvents(blockCount: number = 300): Promise<any[]> {
    const web3 = await this.getWeb3();
    const contract = new web3.eth.Contract(
      ABI.ITEM_TOKEN,
      process.env.SC_FASHION_TOKEN,
    );
    // console.log("scan fashion events")
    const events = await getEventsRange(
      contract,
      web3.currentBlock,
      ['Transfer'],
      blockCount,
    );
    return Promise.all(
      (events || []).map(ev => {
        // console.log(ev);
        const { from, to, tokenId } = ev.returnValues;
        return {
          tx_hash: ev.transactionHash,
          from: from,
          to: to,
          tokenId: tokenId
        }
      })
    )
  }
  async fetchTransferEggEvents(blockCount: number = 300): Promise<any[]> {
    const web3 = await this.getWeb3();
    const contract = new web3.eth.Contract(
      ABI.EGG_TOKEN,
      process.env.SC_EGG_TOKEN,
    );
    const events = await getEventsRange(
      contract,
      web3.currentBlock,
      ['TransferSingle'],
      blockCount,
    );
    return Promise.all(
      (events || []).map(ev => {
        // console.log(ev);
        const { from, to, id, value } = ev.returnValues;
        return {
          tx_hash: ev.transactionHash,
          from: from,
          to: to,
          egg_type: id,
          egg_qty: value
        }
      })
    )
  }
  async fetchBatchTransferEggEvents(blockCount: number = 300): Promise<any[]> {
    const web3 = await this.getWeb3();
    const contract = new web3.eth.Contract(
      ABI.EGG_TOKEN,
      process.env.SC_EGG_TOKEN,
    );
    const events = await getEventsRange(
      contract,
      web3.currentBlock,
      ['TransferBatch'],
      blockCount,
    );
    return Promise.all(
      (events || []).map(ev => {
        console.log(ev);
        const { from, to, ids, values } = ev.returnValues;
        let eggs = [];

        for (let i = 0; i < ids.length; i++) {
          eggs.push({
            type: Number(ids[i]),
            qty: Number(values[i])
          })
        }

        return {
          tx_hash: ev.transactionHash,
          from: from,
          to: to,
          eggs
        }
      })
    )
  }

}
